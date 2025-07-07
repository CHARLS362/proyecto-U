
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search as SearchIcon,
  ListOrdered,
  Eye,
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
import { mockStudents, mockCourses } from '@/lib/mockData';
import type { Student } from '@/lib/mockData';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


// Simula el ID del docente que ha iniciado sesión
const LOGGED_IN_TEACHER_ID = "T1749005331";

export default function TeacherStudentsPage() {
  const { toast } = useToast();
  
  const [allStudents] = useState<Student[]>(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Encuentra los cursos que enseña el docente logueado
  const teacherCourses = useMemo(() => {
    return mockCourses.filter(course => course.instructorId === LOGGED_IN_TEACHER_ID);
  }, []);
  
  // Extrae los IDs de los cursos que enseña el docente
  const teacherCourseIds = useMemo(() => {
      return teacherCourses.map(course => course.id);
  }, [teacherCourses]);

  // Filtra la lista de todos los estudiantes para obtener solo los que están en los cursos del docente
  const studentsOfTeacher = useMemo(() => {
      // Usamos un Set para evitar duplicados si un estudiante está en varios cursos del mismo profesor
      const studentSet = new Set<Student>();
      allStudents.forEach(student => {
          if (student.courses.some(course => teacherCourseIds.includes(course.id))) {
              studentSet.add(student);
          }
      });
      return Array.from(studentSet);
  }, [allStudents, teacherCourseIds]);
  
  const availableClasses = useMemo(() => {
    const classSet = new Set(teacherCourses.map(c => c.classId || ''));
    return Array.from(classSet).filter(Boolean);
  }, [teacherCourses]);
  
  const classDisplayMapping: { [key: string]: string } = {
      "5-sec": "5º de Secundaria",
      "3-sec": "3º de Secundaria",
      "4-sec": "4º de Secundaria",
  };


  const handleSearch = () => {
    let students = studentsOfTeacher;

    if (selectedClass !== 'all') {
      students = students.filter(s => s.classId === selectedClass);
    }
    if (selectedSection !== 'all') {
      students = students.filter(s => s.section === selectedSection);
    }

    if (searchTerm) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(students);
    toast({
        title: "Búsqueda Realizada",
        description: `Se encontraron ${students.length} estudiantes.`,
        variant: "info",
    });
  };

  // Carga inicial de estudiantes
  useState(() => {
    setFilteredStudents(studentsOfTeacher);
  });

  return (
    <>
    <div className="space-y-6">
      <PageTitle title="Mis Estudiantes" subtitle="Vea la información de los estudiantes de sus clases." icon={Users} />

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Filtro de Estudiantes</CardTitle>
          <CardDescription>Seleccione una clase y sección para ver la lista de estudiantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="class">Clase</Label>
               <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Seleccionar Clase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas mis clases</SelectItem>
                  {availableClasses.map(classId => (
                     <SelectItem key={classId} value={classId}>{classDisplayMapping[classId] || classId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="section">Sección</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Seleccionar Sección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las secciones</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 md:col-span-2">
               <Label htmlFor="search">Buscar por nombre o ID</Label>
               <div className="flex gap-2">
                <Input 
                  id="search" 
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Lista de estudiantes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Identificación de estudiante</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apoderado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{index + 1}.</TableCell>
                    <TableCell className="text-muted-foreground">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                         <span className="font-medium text-foreground">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.guardianName}</TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No se encontraron estudiantes con los filtros actuales.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {filteredStudents.length > 0 && (
            <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => toast({description: "Ya estás en la primera página."})}>anterior</Button>
                <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary">1</Button>
                <Button variant="outline" size="sm" onClick={() => toast({description: "No hay más páginas."})}>próximo</Button>
            </CardFooter>
        )}
      </Card>
    </div>
    </>
  );
}
