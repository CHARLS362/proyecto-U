
'use client';

import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { BookOpenText, PlusCircle, Search as SearchIcon, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { mockCourses, type Course } from '@/lib/mockData';

export default function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const [courseName, setCourseName] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const handleOpenModal = (mode: 'add' | 'edit', course: Course | null = null) => {
    setModalMode(mode);
    if (mode === 'edit' && course) {
      setCurrentCourse(course);
      setCourseName(course.name);
      setCourseLevel(course.level);
    } else {
      setCurrentCourse(null);
      setCourseName('');
      setCourseLevel('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseLevel) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (modalMode === 'add') {
            const newCourse = {
                id: `C${Date.now()}`,
                name: courseName,
                level: courseLevel,
                // Add other required fields with default values
                code: courseName.slice(0,3).toUpperCase() + Math.floor(Math.random() * 100),
                description: '',
                schedule: '',
                instructor: 'Por asignar',
                department: 'General',
            } as Course;
            setCourses(prev => [...prev, newCourse]);
            toast({ title: "Curso Agregado", description: `El curso "${courseName}" ha sido creado.`, variant: "success" });
        } else if (currentCourse) {
            setCourses(prev => prev.map(c => 
                c.id === currentCourse.id ? { ...c, name: courseName, level: courseLevel as any } : c
            ));
            toast({ title: "Curso Actualizado", description: `El curso "${courseName}" ha sido actualizado.`, variant: "success" });
        }

        handleCloseModal();
    } catch(error) {
        toast({ title: "Error", description: "No se pudo guardar el curso. Inténtelo de nuevo.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleDeleteCourse = async (course: Course) => {
    setDeletingId(course.id);
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourses(prev => prev.filter(c => c.id !== course.id));
        toast({ title: "Curso Eliminado", description: `Se eliminó "${course.name}".`, variant: "success"});
    } catch(error) {
        toast({ title: "Error al Eliminar", description: `No se pudo eliminar "${course.name}".`, variant: "destructive"});
    } finally {
        setDeletingId(null);
    }
  };

  const levelBadgeColor = (level: string) => {
    switch(level) {
      case 'Primaria': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Secundaria': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Ambos': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      default: return 'bg-muted text-muted-foreground';
    }
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Cursos" subtitle={`Total de ${courses.length} cursos disponibles.`} icon={BookOpenText}>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Curso
          </Link>
        </Button>
      </PageTitle>

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center">
             <CardTitle className="text-lg">Lista de Cursos</CardTitle>
             <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar curso..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre del Curso</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-primary">{course.code}</TableCell>
                  <TableCell>
                    <Link href={`/admin/courses/${course.id}`} className="font-medium text-foreground hover:underline">
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={levelBadgeColor(course.level)}>
                      {course.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.department}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{course.instructor}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline" className="mr-2">
                        <Link href={`/admin/courses/${course.id}`}>
                            <Edit className="mr-1 h-3 w-3" /> Ver/Editar
                        </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course)} disabled={deletingId === course.id}>
                      {deletingId === course.id ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="mr-1 h-3 w-3" />
                      )}
                      Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCourses.length === 0 && (
            <p className="p-6 text-center text-muted-foreground">
              No se encontraron cursos.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
