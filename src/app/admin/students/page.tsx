'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Filter,
  UserPlus,
  UserMinus,
  Search as SearchIcon,
  Edit,
  Trash2,
  FileText,
  ListOrdered,
  MessageSquare,
  Send,
  Camera,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageTitle } from '@/components/common/PageTitle';
import { useStudents, type Student } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';
import { generateUniqueId } from '@/lib/idGenerator';
import { formatDateForInput } from '@/lib/dateUtils';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';


const studentFormSchema = z.object({
  // Paso 1
  studentFirstName: z.string().min(2, "El nombre es obligatorio."),
  studentLastName: z.string().min(2, "El apellido es obligatorio."),
  guardianName: z.string().min(2, "El nombre del apoderado es obligatorio."),
  studentDob: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  studentGender: z.string({ required_error: "Por favor, seleccione un género." }),
  studentClass: z.string().min(1, "La clase es obligatoria."),
  studentSection: z.string({ required_error: "Por favor, seleccione una sección." }),
  studentPhoto: z.any().optional(),

  // Paso 2
  studentPhone: z.string().length(9, "El número de celular debe tener 9 dígitos."),
  studentEmail: z.string().email("Correo electrónico inválido."),
  studentAddress: z.string().min(5, "La dirección es obligatoria."),
  studentDepartment: z.string().min(2, "El departamento es obligatorio."),
  studentCity: z.string().min(2, "La ciudad es obligatoria."),
  
  // Paso 3
  guardianPhone: z.string().length(9, "El celular del apoderado debe tener 9 dígitos."),
  guardianEmail: z.string().email("Correo electrónico del apoderado inválido."),
  guardianAddress: z.string().min(5, "La dirección del apoderado es obligatoria."),
  guardianDob: z.string().min(1, "La fecha de nacimiento del apoderado es obligatoria."),
});


type StudentFormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<StudentFormValues> = {
  studentFirstName: "",
  studentLastName: "",
  guardianName: "",
  studentDob: "",
  studentGender: "",
  studentClass: "",
  studentSection: "A",
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


export default function StudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent } = useStudents();
  const { classes, loading: classesLoading } = useClasses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState('Ningún archivo seleccionado');

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Observar cambios en la clase seleccionada para actualizar las secciones dinámicamente
  const selectedClass = form.watch('studentClass');
  
  // Limpiar la sección cuando cambie la clase
  useEffect(() => {
    if (selectedClass) {
      form.setValue('studentSection', 'A');
    }
  }, [selectedClass, form]);
  
  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      form.reset();
      setStep(1);
      setPhotoPreview(null);
      setPhotoFileName('Ningún archivo seleccionado');
      setModalMode('add');
      setCurrentStudentId(null);
    }
  }

  const handleOpenAddModal = () => {
    handleModalChange(false); // Reset form before opening
    setModalMode('add');
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (student: Student) => {
    handleModalChange(false);
    setModalMode('edit');
    setCurrentStudentId(student.id);

    form.setValue('studentFirstName', student.primer_nombre);
    form.setValue('studentLastName', student.apellido);
    form.setValue('guardianName', student.nombre_tutor || '');
    
    // Formatear la fecha de nacimiento usando la función de utilidad
    if (student.fecha_nacimiento) {
      form.setValue('studentDob', formatDateForInput(student.fecha_nacimiento));
    }
    
    form.setValue('studentGender', student.genero || '');
    form.setValue('studentClass', student.nivel_grado || '');
    form.setValue('studentSection', student.seccion || 'A');
    form.setValue('studentPhone', student.telefono || '');
    form.setValue('studentEmail', student.correo);
    form.setValue('studentAddress', student.direccion || '');
    form.setValue('studentDepartment', student.departamento || '');
    form.setValue('studentCity', student.ciudad || '');
    form.setValue('guardianPhone', student.contacto_tutor || '');
    form.setValue('guardianEmail', student.correo_tutor || '');
    form.setValue('guardianAddress', student.direccion_tutor || '');
    
    if (student.fecha_nacimiento_tutor) {
      form.setValue('guardianDob', formatDateForInput(student.fecha_nacimiento_tutor));
    }
    
    if (student.url_avatar) {
      setPhotoPreview(student.url_avatar);
      setPhotoFileName('Foto actual');
    }
    
    setIsModalOpen(true);
  };

  const openDeleteAlert = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      await deleteStudent(studentToDelete.id);
      toast({ 
        title: "Estudiante Eliminado", 
        description: `El estudiante ${studentToDelete.primer_nombre} ${studentToDelete.apellido} ha sido eliminado exitosamente.`,
        variant: "success"
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "No se pudo eliminar el estudiante.", 
        variant: "destructive"
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setStudentToDelete(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  async function onSubmit(data: StudentFormValues) {
    try {
      if (modalMode === 'add') {
        const studentData = {
          nombre: `${data.studentFirstName} ${data.studentLastName}`,
          primer_nombre: data.studentFirstName,
          apellido: data.studentLastName,
          url_avatar: photoPreview || null,
          correo: data.studentEmail,
          telefono: data.studentPhone,
          fecha_matricula: new Date().toISOString().split('T')[0],
          direccion: data.studentAddress,
          nivel_grado: data.studentClass,
          nombre_tutor: data.guardianName,
          contacto_tutor: data.guardianPhone,
          fecha_nacimiento: data.studentDob,
          genero: data.studentGender,
          seccion: data.studentSection,
          departamento: data.studentDepartment,
          ciudad: data.studentCity,
          correo_tutor: data.guardianEmail,
          direccion_tutor: data.guardianAddress,
          fecha_nacimiento_tutor: data.guardianDob
        };

        await createStudent(studentData);
        toast({ 
          title: "Estudiante Agregado", 
          description: `El estudiante ${data.studentFirstName} ${data.studentLastName} ha sido registrado exitosamente.`,
          variant: "success"
        });
      } else if (currentStudentId) {
        const updateData = {
          nombre: `${data.studentFirstName} ${data.studentLastName}`,
          primer_nombre: data.studentFirstName,
          apellido: data.studentLastName,
          url_avatar: photoPreview || null,
          correo: data.studentEmail,
          telefono: data.studentPhone,
          direccion: data.studentAddress,
          nivel_grado: data.studentClass,
          nombre_tutor: data.guardianName,
          contacto_tutor: data.guardianPhone,
          fecha_nacimiento: data.studentDob,
          genero: data.studentGender,
          seccion: data.studentSection,
          departamento: data.studentDepartment,
          ciudad: data.studentCity,
          correo_tutor: data.guardianEmail,
          direccion_tutor: data.guardianAddress,
          fecha_nacimiento_tutor: data.guardianDob
        };

        await updateStudent(currentStudentId, updateData);
        toast({ 
          title: "Estudiante Actualizado", 
          description: `Los datos de ${data.studentFirstName} ${data.studentLastName} han sido actualizados.`,
          variant: "success"
        });
      }
      handleModalChange(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: modalMode === 'add' ? "No se pudo agregar el estudiante." : "No se pudo actualizar el estudiante.", 
        variant: "destructive"
      });
    }
  }
  
  const getStepTitle = (currentStep: number) => {
    switch (currentStep) {
        case 1: return "Paso 1 de 3 - Datos Personales del Estudiante";
        case 2: return "Paso 2 de 3 - Datos de Contacto del Estudiante";
        case 3: return "Paso 3 de 3 - Datos del Apoderado";
        default: return "Formulario de Registro";
    }
  }

  // Filtrado de estudiantes
  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.primer_nombre} ${student.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !filterClass || student.nivel_grado?.toLowerCase().includes(filterClass.toLowerCase());
    const matchesSection = !filterSection || filterSection === 'all' || student.seccion === filterSection;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  // Obtener secciones únicas para el filtro
  const uniqueSections = Array.from(new Set(students.map(student => student.seccion).filter(Boolean)));

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle title="Gestión de Estudiantes" subtitle="Agregue, vea o edite la información de los estudiantes." icon={Users} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando estudiantes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <div className="space-y-6">
        <PageTitle title="Gestión de Estudiantes" subtitle="Agregue, vea o edite la información de los estudiantes." icon={Users} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Error al cargar los estudiantes</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchStudents} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <PageTitle title="Gestión de Estudiantes" subtitle="Agregue, vea o edite la información de los estudiantes." icon={Users} />

      <Tabs defaultValue="mostrar" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="agregar">Agregar estudiantes</TabsTrigger>
          <TabsTrigger value="mostrar">Mostrar estudiantes</TabsTrigger>
          <TabsTrigger value="comentario">Comentario</TabsTrigger>
        </TabsList>

        <TabsContent value="agregar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-xl">Estudiantes</CardTitle>
              </div>
              <Button variant="ghost" size="icon" aria-label="Filtrar estudiantes">
                <Filter className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-start space-x-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border bg-card hover:bg-muted/50 text-foreground"
                  onClick={handleOpenAddModal}
                >
                  <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                    <UserPlus className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-semibold">
                    Agregar Alumno
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-start space-x-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border bg-card hover:bg-muted/50 text-foreground"
                >
                  <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
                    <UserMinus className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-lg font-semibold">
                    Eliminar Alumno
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mostrar" className="mt-6 space-y-6">
           <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Filtros de búsqueda</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="class-filter">Clase</Label>
                  <Input
                    id="class-filter"
                    placeholder="Buscar por clase..."
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section-filter">Sección</Label>
                  <Select value={filterSection} onValueChange={setFilterSection}>
                    <SelectTrigger id="section-filter">
                      <SelectValue placeholder="Todas las secciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las secciones</SelectItem>
                      {uniqueSections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => {
                    setFilterClass('');
                    setFilterSection('all');
                    setSearchTerm('');
                  }}
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Lista de estudiantes ({filteredStudents.length})</CardTitle>
                  </div>
                 <div className="flex w-full sm:w-auto items-center gap-2">
                    <Input
                      placeholder="Buscar por nombre o ID..."
                      className="w-full sm:w-auto bg-card"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Button>
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Identificación de estudiante</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Clase</TableHead>
                    <TableHead>Sección</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{index + 1}.</TableCell>
                      <TableCell className="text-muted-foreground">{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.url_avatar || "https://placehold.co/40x40.png"} alt={`${student.primer_nombre} ${student.apellido}`} data-ai-hint="student avatar" />
                            <AvatarFallback>{student.primer_nombre.substring(0, 1)}{student.apellido.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                           <span className="font-medium text-foreground">{`${student.primer_nombre} ${student.apellido}`}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.nivel_grado || '-'}</TableCell>
                      <TableCell>{student.seccion || '-'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleOpenEditModal(student)}>
                          <Edit className="mr-1 h-3 w-3" /> Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteAlert(student)}>
                          <Trash2 className="mr-1 h-3 w-3" /> Borrar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredStudents.length === 0 && (
                <p className="p-6 text-center text-muted-foreground">
                  No se encontraron estudiantes.
                </p>
              )}
            </CardContent>
             {filteredStudents.length > 0 && (
                <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary">1</Button>
                    <Button variant="outline" size="sm">próximo</Button>
                </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="comentario" className="mt-6 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
                <CardTitle>Comentarios de los estudiantes</CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="comment-class">Clase</Label>
                  <Select defaultValue="5-sec">
                    <SelectTrigger id="comment-class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-sec">3º de Secundaria</SelectItem>
                      <SelectItem value="4-sec">4º de Secundaria</SelectItem>
                      <SelectItem value="5-sec">5º de Secundaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment-section">Sección</Label>
                  <Select defaultValue="A">
                    <SelectTrigger id="comment-section">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment-student">Alumno</Label>
                  <Select defaultValue="S001">
                    <SelectTrigger id="comment-student">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="S001">Ana Pérez</SelectItem>
                        <SelectItem value="S002">Luis García</SelectItem>
                        <SelectItem value="S003">Sofía Rodríguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full md:w-auto">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Encontrar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-lg">
                <CardHeader>
                    <CardTitle>Alumno</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4 border-2 border-border">
                        <AvatarImage src="https://placehold.co/128x128.png" alt="Estudiante" data-ai-hint="student avatar" />
                        <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-foreground">Ana Pérez</h3>
                    <div className="text-left text-sm text-muted-foreground mt-4 space-y-2 w-full bg-muted/30 p-4 rounded-lg">
                        <p><span className="font-medium text-foreground/80">Identificación:</span> S001</p>
                        <p><span className="font-medium text-foreground/80">Teléfono:</span> 987654321</p>
                        <p><span className="font-medium text-foreground/80">Fecha de nacimiento:</span> 10/04/2008</p>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 shadow-lg flex flex-col">
                <CardHeader>
                    <CardTitle>Comentarios</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center bg-muted/50 rounded-md min-h-[200px]">
                    <p className="text-muted-foreground">Sin comentarios</p>
                </CardContent>
                <CardFooter className="p-2 border-t mt-auto">
                    <div className="relative w-full">
                        <Textarea placeholder="Escribe un comentario..." className="pr-12 bg-card resize-none" rows={1} />
                        <Button size="icon" className="absolute right-2 bottom-2 h-8 w-8">
                            <Send className="h-4 w-4"/>
                            <span className="sr-only">Enviar comentario</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>

    <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="sm:max-w-xl">
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>{modalMode === 'add' ? 'Detalles del estudiante' : 'Editar Estudiante'}</DialogTitle>
                <DialogDescription>{getStepTitle(step)}</DialogDescription>
                <Progress value={(step / 3) * 100} className="w-full mt-2" />
              </DialogHeader>

              <div className="py-6 space-y-4 max-h-[70vh] overflow-y-auto pr-6">
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="studentFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de pila" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="studentLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-transparent select-none">Apellido</FormLabel>
                            <FormControl>
                              <Input placeholder="Apellido" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField control={form.control} name="guardianName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del padre</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="studentDob" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de nacimiento</FormLabel>
                                <FormControl><Input type="date" placeholder="dd/mm/aaaa" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="studentGender" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Género</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="--seleccionar--" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="masculino">Masculino</SelectItem>
                                        <SelectItem value="femenino">Femenino</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="studentClass" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Clase</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Primer Grado, Segundo Grado..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="studentSection" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sección</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="--seleccionar--" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="B">B</SelectItem>
                                        <SelectItem value="C">C</SelectItem>
                                        <SelectItem value="D">D</SelectItem>
                                        <SelectItem value="E">E</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="studentPhoto" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto</FormLabel>
                             <div className="flex items-center gap-2">
                                <FormControl>
                                    <Label htmlFor="photo-upload-modal" className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer font-normal")}>
                                        Seleccionar archivo
                                        <Input id="photo-upload-modal" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                                    </Label>
                                </FormControl>
                                <span className="text-sm text-muted-foreground truncate">{photoFileName}</span>
                            </div>
                            <FormMessage />
                             {photoPreview && <Avatar className="mt-4 h-24 w-24"><AvatarImage src={photoPreview} alt="Vista previa de foto" /></Avatar>}
                        </FormItem>
                    )} />
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
                                <Input type="tel" placeholder="987654321" {...field} />
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
                                  <Input type="tel" placeholder="912345678" {...field} />
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
              </div>
              <DialogFooter className="pt-4 border-t">
                  {step > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep}>
                          Anterior
                      </Button>
                  )}
                  <div className="flex-grow" />
                  {step < 3 ? (
                       <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                          próximo 
                          <ChevronRight className="ml-1 h-4 w-4" />
                          <ChevronRight className="-ml-3 h-4 w-4" />
                      </Button>
                  ) : (
                      <Button type="submit">
                          {modalMode === 'add' ? 'Guardar Estudiante' : 'Guardar Cambios'}
                      </Button>
                  )}
              </DialogFooter>
              </form>
            </Form>
        </DialogContent>
    </Dialog>
    
    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutely seguro?</AlertDialogTitle>
            <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente al estudiante
            y sus datos de nuestros servidores.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className={buttonVariants({ variant: "destructive" })}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
