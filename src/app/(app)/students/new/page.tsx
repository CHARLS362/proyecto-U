
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/common/PageTitle";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const studentFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres.").max(50, "El nombre no puede tener más de 50 caracteres."),
  email: z.string().email("Por favor, introduce una dirección de correo electrónico válida."),
  phone: z.string().min(7, "El número de teléfono debe ser válido.").max(15, "El número de teléfono debe ser válido."),
  gradeLevel: z.string().min(1, "El nivel de grado es obligatorio."),
  address: z.string().min(5, "La dirección es obligatoria."),
  guardianName: z.string().optional(),
  guardianContact: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<StudentFormValues> = {
  name: "",
  email: "",
  phone: "",
  gradeLevel: "",
  address: "",
  guardianName: "",
  guardianContact: "",
};

export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: StudentFormValues) {
    console.log("Datos del nuevo estudiante:", data);
    toast({
      title: "Estudiante Agregado (Simulación)",
      description: `El estudiante ${data.name} ha sido registrado exitosamente.`,
    });
    router.push('/students');
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Agregar Nuevo Estudiante" subtitle="Rellene los detalles para registrar un nuevo estudiante." icon={UserPlus}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </PageTitle>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Formulario de Registro de Estudiante</CardTitle>
          <CardDescription>Por favor, complete la información a continuación.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Ana Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="ejemplo@dominio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="555-0101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel de Grado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 10º Grado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle Falsa 123, Ciudad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Tutor (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Carlos Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guardianContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto del Tutor (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="555-0102" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/students')}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Estudiante</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
