'use client';

import { useState, useMemo, useEffect } from 'react';
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
  ChevronRight,
  Loader2,
  User
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
import type { Student } from '@/hooks/useStudents';
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
import { useStudents } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useCourses } from "@/hooks/useCourses";
import axios from 'axios';


const studentFormSchema = z.object({
  primer_nombre: z.string().min(2, "El nombre es obligatorio."),
  apellido: z.string().min(2, "El apellido es obligatorio."),
  nombre_tutor: z.string().min(2, "El nombre del apoderado es obligatorio."),
  fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  genero: z.string({ required_error: "Por favor, seleccione un género." }),
  nivel: z.enum(["Primaria", "Secundaria"], { required_error: "El nivel es obligatorio." }),
  grado: z.string().min(1, "El grado es obligatorio."),
  seccion: z.string({ required_error: "Por favor, seleccione una sección." }),
  fecha_matricula: z.string().min(1, "La fecha de matrícula es obligatoria."),
  id_clase: z.string().optional(),
  url_avatar: z.any().optional(),
  telefono: z.string().length(9, "El número de celular debe tener 9 dígitos."),
  correo: z.string().email("Correo electrónico inválido."),
  direccion: z.string().min(5, "La dirección es obligatoria."),
  departamento: z.string().min(2, "El departamento es obligatorio."),
  ciudad: z.string().min(2, "La ciudad es obligatoria."),
  contacto_tutor: z.string().length(9, "El celular del apoderado debe tener 9 dígitos."),
  correo_tutor: z.string().email("Correo electrónico del apoderado inválido."),
  direccion_tutor: z.string().min(5, "La dirección del apoderado es obligatoria."),
  fecha_nacimiento_tutor: z.string().min(1, "La fecha de nacimiento del apoderado es obligatoria."),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

const defaultValues: Partial<StudentFormValues> = {
  primer_nombre: "",
  apellido: "",
  nombre_tutor: "",
  fecha_nacimiento: "",
  genero: "",
  nivel: undefined,
  grado: "",
  seccion: "A",
  fecha_matricula: new Date().toISOString().split('T')[0],
  id_clase: "",
  telefono: "",
  correo: "",
  direccion: "",
  departamento: "",
  ciudad: "",
  contacto_tutor: "",
  correo_tutor: "",
  direccion_tutor: "",
  fecha_nacimiento_tutor: "",
  url_avatar: "",
};

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

// Función para mapear grado a texto
const gradoToTexto = (grado: number) => {
  const nombres = [
    'Primer Grado',
    'Segundo Grado',
    'Tercer Grado',
    'Cuarto Grado',
    'Quinto Grado',
    'Sexto Grado'
  ];
  return nombres[grado];
};

// Función para mapear texto a número
const textoToGrado = (texto: string) => {
  const nombres = [
    'Primer Grado',
    'Segundo Grado',
    'Tercer Grado',
    'Cuarto Grado',
    'Quinto Grado',
    'Sexto Grado'
  ];
  return nombres.findIndex(n => n === texto);
};


export default function StudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent } = useStudents();
  const { classes, loading: classesLoading } = useClasses();
  const { courses, loading: coursesLoading } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState('Ningún archivo seleccionado');

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Estado para el modal de eliminación rápida
  const [isQuickDeleteOpen, setIsQuickDeleteOpen] = useState(false);
  const [quickDeleteSearch, setQuickDeleteSearch] = useState("");

  // State for Comment Tab
  const [selectedLevelComment, setSelectedLevelComment] = useState('');
  const [selectedGradeComment, setSelectedGradeComment] = useState('');
  const [selectedSectionComment, setSelectedSectionComment] = useState('');
  const [selectedStudentIdComment, setSelectedStudentIdComment] = useState('');
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [comentarioNuevo, setComentarioNuevo] = useState('');
  const [comentariosLoading, setComentariosLoading] = useState(false);

  const [filterNivel, setFilterNivel] = useState("");
  const [filterGrado, setFilterGrado] = useState("");
  const [filterSeccion, setFilterSeccion] = useState("");
  const [filterCurso, setFilterCurso] = useState("");

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setFilterNivel("");
    setFilterGrado("");
    setFilterSeccion("");
    setFilterCurso("");
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  // Limpiar la sección cuando cambie la clase
  useEffect(() => {
    if (form.watch('nivel')) {
      form.setValue('seccion', 'A');
    }
  }, [form.watch('nivel'), form]);
  
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
  
  const handleOpenEditModal = async (student: Student) => {
    // No llamar handleModalChange(false) aquí porque resetea el formulario
    setIsModalOpen(false); // Solo cerrar el modal si está abierto
    setModalMode('edit');
    setCurrentStudentId(student.id);

    // Resetear el formulario manualmente sin usar handleModalChange
    form.reset();
    setStep(1);
    setPhotoPreview(null);
    setPhotoFileName('Ningún archivo seleccionado');

    // Ahora setear los valores del estudiante
    form.setValue('primer_nombre', student.primer_nombre);
    form.setValue('apellido', student.apellido);
    form.setValue('nombre_tutor', student.nombre_tutor || '');
    
    // Formatear la fecha de nacimiento usando la función de utilidad
    if (student.fecha_nacimiento) {
      form.setValue('fecha_nacimiento', student.fecha_nacimiento);
    }
    
    form.setValue('genero', student.genero || '');
    form.setValue('nivel', student.nivel || 'Primaria');
    form.setValue('grado', student.grado ? String(student.grado) : '1');
    form.setValue('seccion', student.seccion || 'A');
    form.setValue('fecha_matricula', student.fecha_matricula || new Date().toISOString().split('T')[0]);
    form.setValue('id_clase', student.id_clase || '');
    form.setValue('telefono', student.telefono || '');
    form.setValue('correo', student.correo);
    form.setValue('direccion', student.direccion || '');
    form.setValue('departamento', student.departamento || '');
    form.setValue('ciudad', student.ciudad || '');
    form.setValue('contacto_tutor', student.contacto_tutor || '');
    form.setValue('correo_tutor', student.correo_tutor || '');
    form.setValue('direccion_tutor', student.direccion_tutor || '');
    
    if (student.fecha_nacimiento_tutor) {
      form.setValue('fecha_nacimiento_tutor', student.fecha_nacimiento_tutor);
    }
    
    if (student.url_avatar) {
      setPhotoPreview(student.url_avatar);
      setPhotoFileName('Foto actual');
    }
    
    await form.trigger(); // Llama a form.trigger() para actualizar la validez del formulario
    setIsModalOpen(true);
  };

  const openDeleteAlert = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);

    try {
      console.log('Intentando eliminar estudiante con ID:', studentToDelete.id);
      console.log('Datos del estudiante a eliminar:', studentToDelete);
      
      const result = await deleteStudent(studentToDelete.id);
      console.log('Resultado de eliminación:', result);
      
      toast({
        title: "Estudiante Eliminado",
        description: `El estudiante ${studentToDelete.primer_nombre} ${studentToDelete.apellido} ha sido eliminado.`,
        variant: "success",
      });
      setIsDeleteAlertOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      console.error('Detalles del error:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      toast({
        title: "Error al Eliminar",
        description: error instanceof Error ? error.message : "No se pudo eliminar al estudiante. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
    let isValid = false;
    
    if (step === 1) {
        isValid = await form.trigger([
          'primer_nombre',
          'apellido', 
          'nombre_tutor',
          'fecha_nacimiento',
          'genero',
          'nivel',
          'grado',
          'seccion'
        ]);
      } else if (step === 2) {
        isValid = await form.trigger([
          'telefono',
          'correo',
          'direccion',
          'departamento',
          'ciudad'
        ]);
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  async function onSubmit(data: StudentFormValues) {
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        const studentData = {
          nombre: `${data.primer_nombre} ${data.apellido}`,
          primer_nombre: data.primer_nombre,
          apellido: data.apellido,
          url_avatar: photoPreview || "https://placehold.co/100x100.png",
          correo: data.correo,
          telefono: data.telefono,
          fecha_matricula: data.fecha_matricula,
          direccion: data.direccion,
          id_clase: data.id_clase,
          nombre_tutor: data.nombre_tutor,
          contacto_tutor: data.contacto_tutor,
          fecha_nacimiento: data.fecha_nacimiento,
          genero: data.genero as any,
          seccion: data.seccion,
          departamento: data.departamento,
          ciudad: data.ciudad,
          correo_tutor: data.correo_tutor,
          direccion_tutor: data.direccion_tutor,
          fecha_nacimiento_tutor: data.fecha_nacimiento_tutor,
          nivel: data.nivel,
          grado: Number(data.grado),
        };

        await createStudent(studentData);
        
        toast({
          title: "Estudiante Agregado",
          description: `El estudiante ${data.primer_nombre} ${data.apellido} ha sido registrado exitosamente.`,
          variant: "success",
        });
      } else if (currentStudentId) {
        // Actualizar estudiante existente
        const updateData = {
          nombre: `${data.primer_nombre} ${data.apellido}`,
          primer_nombre: data.primer_nombre,
          apellido: data.apellido,
          url_avatar: photoPreview,
          correo: data.correo,
          telefono: data.telefono,
          fecha_matricula: data.fecha_matricula,
          direccion: data.direccion,
          id_clase: data.id_clase,
          nombre_tutor: data.nombre_tutor,
          contacto_tutor: data.contacto_tutor,
          fecha_nacimiento: data.fecha_nacimiento,
          genero: data.genero as any,
          seccion: data.seccion,
          departamento: data.departamento,
          ciudad: data.ciudad,
          correo_tutor: data.correo_tutor,
          direccion_tutor: data.direccion_tutor,
          fecha_nacimiento_tutor: data.fecha_nacimiento_tutor,
          nivel: data.nivel,
          grado: Number(data.grado),
        };

        await updateStudent(currentStudentId, updateData);
        
        toast({
          title: "Estudiante Actualizado",
          description: `Los datos de ${data.primer_nombre} ${data.apellido} han sido actualizados.`,
          variant: "success",
        });
      }
      
      handleModalChange(false);
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      toast({
        title: "Error al Guardar",
        description: error instanceof Error ? error.message : "No se pudo guardar el estudiante. Por favor, inténtelo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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

  // Reemplaza el filtro de estudiantes por uno seguro:
  const filteredStudents = useMemo(() => {
    let filtered = students || [];
    if (filterNivel && filterNivel !== "all") filtered = filtered.filter(s => s.nivel === filterNivel);
    if (filterGrado && filterGrado !== "all") {
      // El valor de filterGrado es tipo '1-pri' o '2-sec', pero en la BD es número y nivel
      const [grado, tipo] = filterGrado.split("-");
      filtered = filtered.filter(s => String(s.grado) === grado && (tipo === 'pri' ? s.nivel === 'Primaria' : s.nivel === 'Secundaria'));
    }
    if (filterSeccion && filterSeccion !== "all") filtered = filtered.filter(s => s.seccion === filterSeccion);
    if (filterCurso && filterCurso !== "all") {
      // Filtrar por curso: solo estudiantes que pertenezcan a la clase asociada al curso
      const curso = courses.find(c => c.id === filterCurso);
      if (curso && curso.id_clase) {
        filtered = filtered.filter(s => s.id_clase === String(curso.id_clase));
      } else {
        filtered = [];
      }
    }
    return filtered;
  }, [students, filterNivel, filterGrado, filterSeccion, filterCurso, courses]);

  const filteredStudentsForComment = useMemo(() => {
    if (!selectedGradeComment || !selectedSectionComment) {
      return [];
    }
    const gradoNumber = selectedGradeComment.split('-')[0];
    return students.filter(student => 
      student.nivel === selectedLevelComment &&
      String(student.grado) === gradoNumber &&
      student.seccion === selectedSectionComment
    );
  }, [students, selectedLevelComment, selectedGradeComment, selectedSectionComment]);

  const selectedStudentForComment = useMemo(() => {
    return students.find(s => s.id === selectedStudentIdComment);
  }, [students, selectedStudentIdComment]);

  // Fetch comentarios cuando cambia el alumno seleccionado en la pestaña Comentario
  useEffect(() => {
    if (selectedStudentIdComment) {
      setComentariosLoading(true);
      axios.get(`/api/estudiantes/comentarios-estudiantes?id_estudiante=${selectedStudentIdComment}`)
        .then(res => setComentarios(res.data))
        .catch(() => setComentarios([]))
        .finally(() => setComentariosLoading(false));
    } else {
      setComentarios([]);
    }
  }, [selectedStudentIdComment]);

  // Handler para enviar comentario
  const handleEnviarComentario = async () => {
    if (!comentarioNuevo.trim() || !selectedStudentIdComment) return;
    await axios.post('/api/estudiantes/comentarios-estudiantes', {
      id_estudiante: selectedStudentIdComment,
      autor: 'admin@sofiaeduca.com',
      comentario: comentarioNuevo.trim(),
    });
    setComentarioNuevo('');
    // Refrescar comentarios
    setComentariosLoading(true);
    axios.get(`/api/estudiantes/comentarios-estudiantes?id_estudiante=${selectedStudentIdComment}`)
      .then(res => setComentarios(res.data))
      .catch(() => setComentarios([]))
      .finally(() => setComentariosLoading(false));
  };

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
                  onClick={() => setIsQuickDeleteOpen(true)}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="grid gap-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select value={filterNivel || 'all'} onValueChange={v => { setFilterNivel(v); setFilterGrado(''); }}>
                        <SelectTrigger id="level">
                            <SelectValue placeholder="Seleccionar Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Primaria">Primaria</SelectItem>
                            <SelectItem value="Secundaria">Secundaria</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="grade">Grado</Label>
                    <Select value={filterGrado || 'all'} onValueChange={setFilterGrado} disabled={!filterNivel || filterNivel === 'all'}>
                        <SelectTrigger id="grade">
                            <SelectValue placeholder="Seleccione un nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {filterNivel === 'Primaria' && primaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                            {filterNivel === 'Secundaria' && secondaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="section">Sección</Label>
                    <Select value={filterSeccion || 'all'} onValueChange={setFilterSeccion}>
                        <SelectTrigger id="section">
                            <SelectValue placeholder="Seleccionar Sección" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="course">Curso</Label>
                    <Select value={filterCurso || 'all'} onValueChange={setFilterCurso} disabled={coursesLoading || !courses.length}>
                        <SelectTrigger id="course">
                            <SelectValue placeholder={coursesLoading ? "Cargando..." : (!courses.length ? "Sin cursos" : "Seleccionar Curso")}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {courses.map(curso => (
                                <SelectItem key={curso.id} value={curso.id}>{curso.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center mt-4 lg:mt-0">
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleClearFilters} type="button">
                    <Filter className="mr-1 h-4 w-4" /> Limpiar filtro
                  </Button>
                </div>
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
                    <Button onClick={() => setSearchTerm(searchTerm)}>
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
                  {filteredStudents.filter(student => {
                    const nombre = student?.primer_nombre || '';
                    const apellido = student?.apellido || '';
                    return `${nombre} ${apellido}`.toLowerCase().includes((searchTerm || '').toLowerCase()) || student.id.toLowerCase().includes((searchTerm || '').toLowerCase());
                  }).map((student, index) => (
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
                      <TableCell>
                        {student.clase_display || `${student.grado}° de ${student.nivel}`}
                      </TableCell>
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
                    <Label htmlFor="comment-level">Nivel</Label>
                    <Select value={selectedLevelComment} onValueChange={(value) => {
                        setSelectedLevelComment(value);
                        setSelectedGradeComment('');
                        setSelectedStudentIdComment('');
                    }}>
                        <SelectTrigger id="comment-level">
                            <SelectValue placeholder="Seleccionar Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Primaria">Primaria</SelectItem>
                            <SelectItem value="Secundaria">Secundaria</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="comment-grade">Grado</Label>
                    <Select value={selectedGradeComment} onValueChange={(value) => {
                        setSelectedGradeComment(value);
                        setSelectedStudentIdComment('');
                    }} disabled={!selectedLevelComment}>
                        <SelectTrigger id="comment-grade">
                            <SelectValue placeholder={!selectedLevelComment ? "Seleccione nivel" : "Seleccionar Grado"} />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedLevelComment === 'Primaria' && primaryGrades.map(g => <SelectItem key={`comment-p-${g.value}`} value={g.value}>{g.label}</SelectItem>)}
                            {selectedLevelComment === 'Secundaria' && secondaryGrades.map(g => <SelectItem key={`comment-s-${g.value}`} value={g.value}>{g.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="comment-section">Sección</Label>
                    <Select value={selectedSectionComment} onValueChange={(value) => {
                        setSelectedSectionComment(value);
                        setSelectedStudentIdComment('');
                    }}>
                        <SelectTrigger id="comment-section">
                            <SelectValue placeholder="Seleccionar Sección" />
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
                  <Select value={selectedStudentIdComment} onValueChange={setSelectedStudentIdComment} disabled={!selectedGradeComment || !selectedSectionComment}>
                    <SelectTrigger id="comment-student">
                      <SelectValue placeholder={!selectedGradeComment || !selectedSectionComment ? "Seleccione grado y sección" : "Seleccionar Alumno"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudentsForComment.map(student => (
                        <SelectItem key={`comment-stud-${student.id}`} value={student.id}>{student.primer_nombre} {student.apellido}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-lg">
                <CardHeader>
                    <CardTitle>Alumno</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                    {selectedStudentForComment ? (
                        <>
                            <Avatar className="h-32 w-32 mb-4 border-2 border-border">
                                <AvatarImage src={selectedStudentForComment.url_avatar || ''} alt={selectedStudentForComment.primer_nombre} data-ai-hint="student avatar" />
                                <AvatarFallback>{selectedStudentForComment.primer_nombre.slice(0,2)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-semibold text-foreground">{selectedStudentForComment.primer_nombre} {selectedStudentForComment.apellido}</h3>
                            <div className="text-left text-sm text-muted-foreground mt-4 space-y-2 w-full bg-muted/30 p-4 rounded-lg">
                                <p><span className="font-medium text-foreground/80">Identificación:</span> {selectedStudentForComment.id}</p>
                                <p><span className="font-medium text-foreground/80">Teléfono:</span> {selectedStudentForComment.telefono}</p>
                                <p><span className="font-medium text-foreground/80">Fecha de nacimiento:</span> {selectedStudentForComment.fecha_nacimiento ? new Date(selectedStudentForComment.fecha_nacimiento).toLocaleDateString('es-ES') : ''}</p>
                            </div>
                        </>
                    ) : (
                         <div className="flex flex-col items-center justify-center py-10 h-full text-muted-foreground">
                            <User className="h-16 w-16 mb-4 opacity-50" />
                            <p className="font-medium">Seleccione un estudiante</p>
                            <p className="text-sm text-center">Use los filtros de arriba para encontrar y seleccionar un estudiante.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 shadow-lg flex flex-col">
                <CardHeader>
                    <CardTitle>Comentarios</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-2 bg-muted/50 rounded-md min-h-[200px]">
                    {comentariosLoading ? (
                      <p className="text-muted-foreground">Cargando comentarios...</p>
                    ) : comentarios.length === 0 ? (
                      <p className="text-muted-foreground">Sin comentarios</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {comentarios.map(c => (
                          <div key={c.id} className="bg-background rounded-md p-3 border border-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              <span className="font-semibold text-foreground">{c.autor}</span>
                              <span>•</span>
                              <span>{new Date(c.fecha).toLocaleString('es-PE')}</span>
                            </div>
                            <div className="text-foreground text-sm">{c.comentario}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-2 border-t mt-auto">
                    <div className="relative w-full flex gap-2">
                      <Textarea
                        placeholder="Escribe un comentario..."
                        className="pr-12 bg-card resize-none"
                        rows={1}
                        value={comentarioNuevo}
                        onChange={e => setComentarioNuevo(e.target.value)}
                        disabled={!selectedStudentIdComment || comentariosLoading}
                      />
                      <Button size="icon" className="h-8 w-8" onClick={handleEnviarComentario} disabled={!comentarioNuevo.trim() || !selectedStudentIdComment || comentariosLoading}>
                        <Send className="h-4 w-4" />
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
                        name="primer_nombre"
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
                        name="apellido"
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

                    <FormField control={form.control} name="nombre_tutor" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del padre</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de nacimiento</FormLabel>
                                <FormControl><Input type="date" placeholder="dd/mm/aaaa" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="genero" render={({ field }) => (
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
                        <FormField control={form.control} name="nivel" render={({ field }) => (
  <FormItem>
    <FormLabel>Nivel</FormLabel>
    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar Nivel" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Primaria">Primaria</SelectItem>
        <SelectItem value="Secundaria">Secundaria</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />
<FormField control={form.control} name="grado" render={({ field }) => (
  <FormItem>
    <FormLabel>Grado</FormLabel>
    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar Grado" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
        <SelectItem value="3">3</SelectItem>
        <SelectItem value="4">4</SelectItem>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="6">6</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />
                    </div>

                    <FormField control={form.control} name="seccion" render={({ field }) => (
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
                )}
                {step === 2 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <FormField
                          control={form.control}
                          name="telefono"
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
                          name="correo"
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
                        name="direccion"
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
                          name="departamento"
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
                          name="ciudad"
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
                        <h3 className="text-lg font-medium text-foreground">Datos del Apoderado: {form.getValues("nombre_tutor")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <FormField
                            control={form.control}
                            name="contacto_tutor"
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
                            name="correo_tutor"
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
                          name="direccion_tutor"
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
                            name="fecha_nacimiento_tutor"
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
                      <Button type="submit" disabled={isSaving}>
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            <AlertDialogAction onClick={handleDeleteStudent} disabled={isDeleting} className={buttonVariants({ variant: "destructive" })}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continuar
            </AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    {/* Modal de eliminación rápida */}
    <Dialog open={isQuickDeleteOpen} onOpenChange={setIsQuickDeleteOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Eliminar Alumno</DialogTitle>
          <DialogDescription>
            Busca y selecciona el alumno que deseas eliminar.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Buscar por nombre o ID..."
          value={quickDeleteSearch}
          onChange={e => setQuickDeleteSearch(e.target.value)}
          className="mb-4"
        />
        <div className="max-h-72 overflow-y-auto divide-y divide-border">
          {(students || [])
            .filter(student => {
              const nombre = student?.primer_nombre || '';
              const apellido = student?.apellido || '';
              return (
                `${nombre} ${apellido}`.toLowerCase().includes(quickDeleteSearch.toLowerCase()) ||
                student.id.toLowerCase().includes(quickDeleteSearch.toLowerCase())
              );
            })
            .map(student => (
              <div key={student.id} className="flex items-center justify-between py-2 gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.url_avatar || "https://placehold.co/40x40.png"} alt={`${student.primer_nombre} ${student.apellido}`} />
                    <AvatarFallback>{student.primer_nombre.substring(0, 1)}{student.apellido.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{student.primer_nombre} {student.apellido}</span>
                  <span className="text-xs text-muted-foreground ml-2">{student.id}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsQuickDeleteOpen(false);
                    openDeleteAlert(student);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </div>
            ))}
          {students.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No hay estudiantes registrados.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsQuickDeleteOpen(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
