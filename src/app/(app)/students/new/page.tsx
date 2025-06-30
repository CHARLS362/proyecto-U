
'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/common/PageTitle";
import { UserPlus, ArrowLeft, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const studentFormSchema = z.object({
  // Paso 1
  studentName: z.string().min(2, "El nombre del estudiante es obligatorio."),
  guardianName: z.string().min(2, "El nombre del apoderado es obligatorio."),
  studentDob: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  studentGender: z.string({ required_error: "Por favor, seleccione un género." }),
  studentPhoto: z.any().optional(),

  // Paso 2
  studentPhone: z.string().min(7, "El número de teléfono debe tener al menos 7 dígitos."),
  studentEmail: z.string().email("Correo electrónico inválido."),
  studentAddress: z.string().min(5, "La dirección es obligatoria."),
  studentDepartment: z.string().min(2, "El departamento es obligatorio."),
  studentCity: z.string().min(2, "La ciudad es obligatoria."),
  
  // Paso 3
  guardianPhone: z.string().min(7, "El teléfono del apoderado debe tener al menos 7 dígitos."),
  guardianEmail: z.string().email("Correo electrónico del apoderado inválido."),
  guardianAddress: z.string().min(5, "La dirección del apoderado es obligatoria."),
  guardianDob: z.string().min(1, "La fecha de nacimiento del apoderado es obligatoria."),
});


type StudentFormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<StudentFormValues> = {
  studentName: "",
  guardianName: "",
  studentDob: "",
  studentGender: "",
  studentPhone: "",
  studentEmail: "",
  studentAddress: "",
  studentDepartment: "",
  studentCity: "",
  guardianPhone: "",
  guardianEmail: "",
  guardianAddress: "",
  guardianDob: "",
};


export default function NewStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        form.setValue("studentPhoto", file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const nextStep = async () => {
    let fieldsToValidate: (keyof StudentFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['studentName', 'guardianName', 'studentDob', 'studentGender'];
    } else if (step === 2) {
      fieldsToValidate = ['studentPhone', 'studentEmail', 'studentAddress', 'studentDepartment', 'studentCity'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if(isValid) {
        setStep(s => s + 1);
    } else {
       toast({
         variant: 'destructive',
         title: 'Campos Incompletos',
         description: 'Por favor, rellene todos los campos requeridos antes de continuar.',
       });
    }
  };

  const prevStep = () => {
    setStep(s => s - 1);
  };

  function onSubmit(data: StudentFormValues) {
    console.log("Datos del nuevo estudiante:", data);
    toast({
      title: "Estudiante Agregado (Simulación)",
      description: `El estudiante ${data.studentName} ha sido registrado exitosamente.`,
    });
    router.push('/students');
  }
  
  const getStepTitle = (currentStep: number) => {
    switch (currentStep) {
        case 1: return "Paso 1 de 3 - Datos Personales del Estudiante";
        case 2: return "Paso 2 de 3 - Datos de Contacto del Estudiante";
        case 3: return "Paso 3 de 3 - Datos del Apoderado";
        default: return "Formulario de Registro";
    }
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
          <CardDescription>{getStepTitle(step)}</CardDescription>
          <Progress value={(step / 3) * 100} className="w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo del Estudiante</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Juan Almendro" {...field} />
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
                          <FormLabel>Nombre del Padre o Apoderado</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Roberto Almendro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <FormField
                        control={form.control}
                        name="studentDob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                          control={form.control}
                          name="studentGender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Género</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione un género" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="masculino">Masculino</SelectItem>
                                    <SelectItem value="femenino">Femenino</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                  </SelectContent>
                                </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="studentPhoto"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto del Estudiante</FormLabel>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-24 w-24 border">
                                    <AvatarImage src={photoPreview || undefined} alt="Vista previa de foto" data-ai-hint="student photo" />
                                    <AvatarFallback><Camera className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
                                </Avatar>
                                <FormControl>
                                    <Button asChild variant="outline">
                                        <label htmlFor="photo-upload" className="cursor-pointer">
                                            Subir Foto
                                            <Input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                                        </label>
                                    </Button>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormField
                      control={form.control}
                      name="studentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Celular</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Ej: 987654321" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="studentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="estudiante@ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="studentAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Av. Los Girasoles 123" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormField
                      control={form.control}
                      name="studentDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Lima" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="studentCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Miraflores" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {step === 3 && (
                 <div className="space-y-8 animate-fade-in">
                    <h3 className="text-lg font-medium text-foreground">Datos del Apoderado: {form.getValues("guardianName")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <FormField
                        control={form.control}
                        name="guardianPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Celular del Apoderado</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Ej: 912345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="guardianEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo del Apoderado</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="apoderado@ejemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="guardianAddress"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Dirección del Apoderado</FormLabel>
                          <FormControl>
                              <Input placeholder="Ej: Calle Las Begonias 456" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="guardianDob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Nacimiento del Apoderado</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                 </div>
              )}

              <div className="flex justify-between gap-4 pt-4 border-t">
                <div>
                  {step > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep}>
                          Anterior
                      </Button>
                  ) : (
                      <Button type="button" variant="outline" onClick={() => router.push('/students')}>
                          Cancelar
                      </Button>
                  )}
                </div>
                <div>
                  {step < 3 ? (
                       <Button type="button" onClick={nextStep}>
                          Siguiente
                      </Button>
                  ) : (
                      <Button type="submit">
                          Guardar Estudiante
                      </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
