
'use client';

import { useState, useMemo } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Award, 
  FileText, 
  Filter, 
  Upload, 
  ChevronRight, 
  List, 
  Save, 
  ArrowLeft,
  Search,
  Database
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockCourses, mockStudents, type Student } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";

// Simula el ID del docente que ha iniciado sesión
const LOGGED_IN_TEACHER_ID = "T1749005331";

export default function TeacherQualificationsPage() {
  const { toast } = useToast();
  const [isEnteringGrades, setIsEnteringGrades] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentsForGrading, setStudentsForGrading] = useState<Student[]>([]);

  const teacherCourses = useMemo(() => {
    return mockCourses.filter(course => course.instructorId === LOGGED_IN_TEACHER_ID);
  }, []);

  const availableClasses = useMemo(() => {
    const classSet = new Set(teacherCourses.map(c => c.classId || ''));
    return Array.from(classSet).filter(Boolean);
  }, [teacherCourses]);

  const classDisplayMapping: { [key: string]: string } = {
      "5-sec": "5º de Secundaria",
      "3-sec": "3º de Secundaria",
      "4-sec": "4º de Secundaria",
  };
  
  const studentsOfTeacher = useMemo(() => {
      const studentSet = new Set<Student>();
      const teacherCourseIds = teacherCourses.map(c => c.id);
      mockStudents.forEach(student => {
          if (student.courses.some(course => teacherCourseIds.includes(course.id))) {
              studentSet.add(student);
          }
      });
      return Array.from(studentSet);
  }, [teacherCourses]);

  const handleContinue = (filters: { class: string, section: string, course: string }) => {
    let students = studentsOfTeacher;
    if (filters.class) {
      students = students.filter(s => s.classId === filters.class);
    }
    if (filters.section) {
      students = students.filter(s => s.section === filters.section);
    }
    if (filters.course) {
        students = students.filter(student => student.courses.some(c => c.id === filters.course));
    }
    setStudentsForGrading(students);
    setIsDialogOpen(false);
    setIsEnteringGrades(true);
  };

  const handleBack = () => {
    setIsEnteringGrades(false);
    setStudentsForGrading([]);
  };
  
  const UploadDialog = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const onContinue = () => {
        if (!selectedClass || !selectedSection || !selectedCourse) {
            toast({ title: "Faltan filtros", description: "Por favor, seleccione grado, sección y curso.", variant: "destructive" });
            return;
        }
        handleContinue({class: selectedClass, section: selectedSection, course: selectedCourse});
    }

    return (
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <DialogTitle>Subir resultado</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="grid gap-2">
            <Label htmlFor="exam-title">Título de Examen</Label>
            <Input id="exam-title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="class-select">Grado</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select">
                    <SelectValue placeholder="Grado"/>
                </SelectTrigger>
                <SelectContent>
                    {availableClasses.map(classId => (
                        <SelectItem key={classId} value={classId}>{classDisplayMapping[classId] || classId}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="section-select">Sección</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger id="section-select">
                    <SelectValue placeholder="Sección"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="total-marks">Calificación</Label>
                <Input id="total-marks" placeholder="20" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="passing-marks">Calificaciones aprobatorias</Label>
                <Input id="passing-marks" placeholder="11" />
            </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="subject-select">Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="subject-select">
                    <SelectValue placeholder="Seleccionar Curso" />
                </SelectTrigger>
                <SelectContent>
                    {teacherCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
            <Button type="button" onClick={onContinue}>
            Continuar <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </DialogFooter>
        </DialogContent>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Calificaciones" icon={Award} />
      
      <Tabs defaultValue="subir-calificaciones" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="subir-calificaciones">Subir calificaciones</TabsTrigger>
          <TabsTrigger value="ver-calificaciones">Ver calificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="subir-calificaciones" className="mt-6">
          {!isEnteringGrades ? (
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Subir calificaciones</CardTitle>
                </div>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </CardHeader>
              <Separator />
              <CardContent>
                <div className="flex justify-center items-center py-16">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-auto p-6 flex flex-col items-center justify-center space-y-3 rounded-lg shadow-md bg-card hover:bg-muted/50 border-border cursor-pointer">
                        <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-md">
                          <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">Subir Calificaciones</span>
                      </Button>
                    </DialogTrigger>
                    <UploadDialog />
                  </Dialog>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="p-3">
                {/* Empty footer for spacing */}
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Ingresar Calificaciones</CardTitle>
                </div>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <List className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Mostrando {studentsForGrading.length} Estudiantes</h3>
                  </div>
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>ID de Estudiante</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Puntuación total</TableHead>
                      <TableHead className="text-center">Nota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsForGrading.map((student, index) => (
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
                            <TableCell className="text-center">20</TableCell>
                            <TableCell className="text-center">
                                <Input type="number" min="0" max="20" placeholder="--" className="w-24 mx-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end pt-4 mt-4 border-t">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Calificaciones
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ver-calificaciones" className="mt-6">
           <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Buscar Reportes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="view-class">Grado</Label>
                    <Select>
                      <SelectTrigger id="view-class">
                        <SelectValue placeholder="Grado" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map(classId => (
                            <SelectItem key={classId} value={classId}>{classDisplayMapping[classId] || classId}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="view-section">Sección</Label>
                    <Select>
                      <SelectTrigger id="view-section">
                        <SelectValue placeholder="Sección" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="view-session">Sesión</Label>
                    <Select defaultValue="2024-25">
                      <SelectTrigger id="view-session">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Exámenes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-accent/20 rounded-full mb-4">
                    <Database className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Sin registro</h3>
                  <p className="text-sm text-muted-foreground">Utilice los filtros para buscar un reporte de calificaciones.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
