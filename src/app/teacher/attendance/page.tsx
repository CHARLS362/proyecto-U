
'use client';

import { useState, useMemo } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, FileText, ClipboardCheck, Database, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { mockStudents, mockCourses, type Student } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";

// Simula el ID del docente que ha iniciado sesión
const LOGGED_IN_TEACHER_ID = "T1749005331";

export default function TeacherAttendancePage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // State for filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  
  // State for student list
  const [isSearching, setIsSearching] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Derivados de la carga académica del docente
  const teacherCourses = useMemo(() => {
    return mockCourses.filter(course => course.instructorId === LOGGED_IN_TEACHER_ID);
  }, []);
  
  const teacherCourseIds = useMemo(() => {
      return teacherCourses.map(course => course.id);
  }, [teacherCourses]);
  
  const studentsOfTeacher = useMemo(() => {
      const studentSet = new Set<Student>();
      mockStudents.forEach(student => {
          if (student.courses.some(course => teacherCourseIds.includes(course.id))) {
              studentSet.add(student);
          }
      });
      return Array.from(studentSet);
  }, [teacherCourseIds]);

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
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      let students = studentsOfTeacher;
      if (selectedClass !== 'all') {
        students = students.filter(s => s.classId === selectedClass);
      }
      if (selectedSection !== 'all') {
        students = students.filter(s => s.section === selectedSection);
      }
      if (selectedCourse !== 'all') {
        students = students.filter(student => student.courses.some(course => course.id === selectedCourse));
      }
      
      setFilteredStudents(students);
      toast({
        title: "Búsqueda Realizada",
        description: `Se encontraron ${students.length} estudiantes.`,
        variant: "info",
      });
      setIsSearching(false);
    }, 500);
  };
  
  // Initialize with all teacher's students
  useState(() => {
    setFilteredStudents(studentsOfTeacher);
  });

  const handleSaveAttendance = async () => {
    if (filteredStudents.length === 0) {
      toast({
        title: "Sin estudiantes",
        description: "No hay estudiantes en la lista para guardar asistencia.",
        variant: "warning",
      });
      return;
    }
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Asistencia Guardada",
        description: `Se ha guardado la asistencia para ${filteredStudents.length} estudiantes.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error al Guardar",
        description: "No se pudo guardar la asistencia. Intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Asistencia" icon={ClipboardCheck} subtitle="Tome y revise la asistencia de sus estudiantes." />
      <Tabs defaultValue="tomar-asistencia" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="tomar-asistencia">Tomar asistencia</TabsTrigger>
          <TabsTrigger value="mostrar-asistencia">Mostrar asistencia</TabsTrigger>
        </TabsList>

        <TabsContent value="tomar-asistencia" className="mt-6">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Seleccionar clase para la asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Grado</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Seleccionar Grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos mis grados</SelectItem>
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
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="course">Curso</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Seleccionar Curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos mis cursos</SelectItem>
                        {teacherCourses.map(course => (
                          <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full md:w-auto" onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Encontrar Estudiantes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Lista de estudiantes ({filteredStudents.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Número de rollo</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Asistencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{index + 1}.</TableCell>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
                                <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-foreground">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                                <Switch id={`attendance-${student.id}`} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No se encontraron estudiantes con los filtros seleccionados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {filteredStudents.length > 0 && (
                <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline">Reiniciar</Button>
                    <Button onClick={handleSaveAttendance} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardCheck className="mr-2 h-4 w-4" />}
                      {isSaving ? 'Guardando...' : 'Guardar Asistencia'}
                    </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mostrar-asistencia" className="mt-6">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Buscar historial de asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="date-class">Grado</Label>
                    <Select>
                      <SelectTrigger id="date-class">
                        <SelectValue placeholder="Seleccionar Grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos mis grados</SelectItem>
                        {availableClasses.map(classId => (
                          <SelectItem key={classId} value={classId}>{classDisplayMapping[classId] || classId}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date-section">Sección</Label>
                    <Select>
                      <SelectTrigger id="date-section">
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
                    <Label htmlFor="date">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd/MM/yyyy") : <span>Seleccione una fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button className="w-full md:w-auto">
                    <Search className="mr-2 h-4 w-4" />
                    Encontrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />
            
            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Hoja de asistencia</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Número de rollo</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Asistencia</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* El estado vacío se muestra a continuación, por lo que no hay filas aquí */}
                        </TableBody>
                    </Table>
                     <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-accent/20 rounded-full mb-4">
                            <Database className="h-12 w-12 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Sin datos</h3>
                        <p className="text-sm text-muted-foreground">Utilice los filtros de arriba para buscar un registro de asistencia.</p>
                    </div>
                </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
