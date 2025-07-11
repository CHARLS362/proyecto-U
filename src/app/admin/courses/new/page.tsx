
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageTitle } from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockTeachers } from "@/lib/mockData";
import { BookOpenText, ChevronLeft, Save } from "lucide-react";
import Link from 'next/link';

const courseFormSchema = z.object({
  code: z.string().min(3, "El código debe tener al menos 3 caracteres."),
  name: z.string().min(3, "El nombre del curso es obligatorio."),
  description: z.string().optional(),
  level: z.string({ required_error: "Debe seleccionar un nivel." }).min(1, "Debe seleccionar un nivel."),
  gradeId: z.string({ required_error: "Debe seleccionar un grado." }).min(1, "Debe seleccionar un grado."),
  section: z.string({ required_error: "Debe seleccionar una sección." }).min(1, "Debe seleccionar una sección."),
  instructorId: z.string({ required_error: "Debe seleccionar un instructor." }).min(1, "Debe seleccionar un instructor."),
  department: z.string().min(3, "El departamento es obligatorio."),
  schedule: z.string().min(5, "El horario es obligatorio."),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const primaryGrades = [
  { value: '1-pri', label: '1º de Primaria' },
  { value: '2-pri', label: '2º de Primaria' },
  { value: '3-pri', label: '3º de Primaria' },
  { value: '4-pri', label: '4º de Primaria' },
  { value: '5-pri', label: '5º de Primaria' },
  { value: '6-pri', label: '6º de Primaria' },
];

const secondaryGrades = [
  { value: '1-sec', label: '1º de Secundaria' },
  { value: '2-sec', label: '2º de Secundaria' },
  { value: '3-sec', label: '3º de Secundaria' },
  { value: '4-sec', label: '4º de Secundaria' },
  { value: '5-sec', label: '5º de Secundaria' },
];

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      level: "",
      gradeId: "",
      section: "",
      instructorId: "",
      department: "",
      schedule: "",
    },
  });

  const selectedLevel = form.watch('level');

  const onSubmit = (data: CourseFormValues) => {
    // In a real app, you would send this data to your backend
    console.log("Nuevo curso creado (simulación):", data);
    toast({
      title: "Curso Creado",
      description: `El curso "${data.name}" ha sido agregado exitosamente.`,
      variant: "success",
    });
    router.push('/admin/courses');
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Agregar Nuevo Curso" icon={BookOpenText}>
        <Button variant="outline" asChild>
            <Link href="/admin/courses">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver a Cursos
            </Link>
        </Button>
      </PageTitle>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Detalles del Curso</CardTitle>
              <CardDescription>Complete la información para registrar un nuevo curso en el sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Curso</FormLabel>
                    <FormControl><Input placeholder="Ej: Álgebra Lineal" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código del Curso</FormLabel>
                    <FormControl><Input placeholder="Ej: MAT-201" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl><Textarea placeholder="Breve descripción del contenido del curso..." {...field} value={field.value ?? ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="level" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nivel Educativo</FormLabel>
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            form.resetField('gradeId');
                        }} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="-- Seleccionar Nivel --" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Primaria">Primaria</SelectItem>
                                <SelectItem value="Secundaria">Secundaria</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="gradeId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Grado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLevel}>
                            <FormControl><SelectTrigger><SelectValue placeholder={!selectedLevel ? "Seleccione un nivel primero" : "-- Seleccionar Grado --"} /></SelectTrigger></FormControl>
                            <SelectContent>
                                {selectedLevel === 'Primaria' && primaryGrades.map(grade => (
                                    <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                                ))}
                                {selectedLevel === 'Secundaria' && secondaryGrades.map(grade => (
                                    <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="section" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sección</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="-- Seleccionar --" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="instructorId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="-- Seleccionar --" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {mockTeachers.map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl><Input placeholder="Ej: Ciencias" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

               <FormField control={form.control} name="schedule" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horario</FormLabel>
                    <FormControl><Input placeholder="Ej: Lu, Mi 10-11:30" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

            </CardContent>
            <CardContent className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Guardar Curso
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
