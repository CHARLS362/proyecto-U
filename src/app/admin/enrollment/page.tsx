
'use client';

import { useState, useMemo } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { 
  ClipboardEdit, 
  Search, 
  Printer, 
  Save,
  CheckCircle,
  Loader2,
  XCircle,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { mockStudents, mockCourses, type Student, type Course } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// This is required for jspdf-autotable to work with jsPDF's TypeScript types
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
      lastAutoTable: { finalY: number };
    }
}

export default function EnrollmentPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Búsqueda vacía",
        description: "Por favor, ingrese un nombre o ID para buscar.",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const results = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      if (results.length === 0) {
        toast({ title: "Sin resultados", description: "No se encontraron estudiantes." });
      } else {
        toast({ title: "Búsqueda completa", description: `Se encontraron ${results.length} estudiantes.` });
      }
      setIsSearching(false);
      setSelectedStudent(null);
      setIsEnrolled(false);
    }, 500);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.name} (${student.id})`);
    setIsEnrolled(false);
    const enrolledCourseIds = new Set(student.courses.map(c => c.id));
    setSelectedCourses(enrolledCourseIds);
    setSearchResults([]);
  };
  
  const resetSelection = () => {
      setSelectedStudent(null);
      setSearchResults([]);
      setSearchTerm('');
      setSelectedCourses(new Set());
      setIsEnrolled(false);
  }

  const availableCourses = useMemo(() => {
    if (!selectedStudent) return [];
    return mockCourses.filter(course => course.classId === selectedStudent.classId);
  }, [selectedStudent]);
  
  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleSaveEnrollment = () => {
    if (!selectedStudent) return;
    setIsSaving(true);
    
    // Simulate backend update
    setTimeout(() => {
        const enrolledCoursesDetails = mockCourses.filter(c => selectedCourses.has(c.id)).map(c => ({
            id: c.id,
            name: c.name,
            progress: 0 // New courses start with 0 progress
        }));

        const updatedStudents = students.map(s => 
            s.id === selectedStudent.id ? { ...s, courses: enrolledCoursesDetails } : s
        );

        setStudents(updatedStudents);
        
        toast({
          title: "Matrícula Guardada",
          description: `El estudiante ${selectedStudent.name} ha sido matriculado en ${selectedCourses.size} cursos.`,
          variant: "success"
        });
        
        setIsSaving(false);
        setIsEnrolled(true);
    }, 1500);
  };
  
  const handlePrint = () => {
    if (!selectedStudent) return;
    
    const doc = new jsPDF();
    const enrolledCoursesDetails = availableCourses.filter(c => selectedCourses.has(c.id));

    doc.setFontSize(20);
    doc.text("Ficha de Matrícula", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);
    
    doc.line(14, 35, doc.internal.pageSize.getWidth() - 14, 35);
    
    doc.setFontSize(14);
    doc.text("Datos del Estudiante", 14, 45);
    doc.setFontSize(11);
    doc.text(`Nombre: ${selectedStudent.name}`, 16, 52);
    doc.text(`ID: ${selectedStudent.id}`, 16, 59);
    doc.text(`Grado: ${selectedStudent.gradeLevel}`, 16, 66);
    doc.text(`Apoderado: ${selectedStudent.guardianName || 'N/A'}`, 16, 73);

    doc.line(14, 80, doc.internal.pageSize.getWidth() - 14, 80);

    doc.setFontSize(14);
    doc.text("Cursos Matriculados", 14, 90);

    doc.autoTable({
        startY: 95,
        head: [['#', 'Código', 'Nombre del Curso', 'Docente']],
        body: enrolledCoursesDetails.map((course, index) => [
            index + 1,
            course.code,
            course.name,
            course.instructor
        ]),
        theme: 'grid',
        headStyles: { fillColor: [33, 150, 243] },
        margin: { left: 14, right: 14 }
    });

    const finalY = doc.lastAutoTable.finalY || 150;
    doc.text("_________________________                 _________________________ ", doc.internal.pageSize.getWidth() / 2, finalY + 30, { align: 'center' });
    doc.text("Firma del Apoderado                   Firma de Administración", doc.internal.pageSize.getWidth() / 2, finalY + 35, { align: 'center' });


    doc.save(`ficha_matricula_${selectedStudent.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Módulo de Matrículas" subtitle="Busque un estudiante para matricularlo en sus cursos." icon={ClipboardEdit} />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Buscar Estudiante</CardTitle>
          <CardDescription>Ingrese el nombre, apellido o ID del estudiante para iniciar el proceso de matrícula.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={!!selectedStudent}
            />
            <Button onClick={handleSearch} disabled={isSearching || !!selectedStudent}>
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Buscar
            </Button>
            {selectedStudent && (
                <Button variant="destructive" onClick={resetSelection}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {searchResults.length > 0 && !selectedStudent && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Resultados de la Búsqueda</CardTitle>
            <CardDescription>
              Se encontraron {searchResults.length} estudiantes. Seleccione uno para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 max-h-60 overflow-y-auto">
            <div className="border-t">
              {searchResults.map(student => (
                <div key={student.id} onClick={() => handleSelectStudent(student)} className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0">
                  <Avatar>
                    <AvatarImage src={student.avatarUrl} data-ai-hint="student avatar"/>
                    <AvatarFallback>{student.name.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.id} - {student.gradeLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStudent && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Cursos para {selectedStudent.name}</CardTitle>
            <CardDescription>
              Grado: <span className="font-semibold text-primary">{selectedStudent.gradeLevel}</span>. Seleccione los cursos en los que desea matricular al estudiante.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEnrolled && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-3 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium">¡Matrícula guardada con éxito!</p>
                </div>
            )}
            {availableCourses.length > 0 ? (
              availableCourses.map(course => (
                <div key={course.id} className="flex items-center space-x-3 p-3 border rounded-md bg-card hover:bg-muted/50">
                  <Checkbox 
                      id={`course-${course.id}`}
                      checked={selectedCourses.has(course.id)}
                      onCheckedChange={() => handleCourseToggle(course.id)}
                      disabled={isSaving || isEnrolled}
                  />
                  <Label htmlFor={`course-${course.id}`} className="flex-1 cursor-pointer">
                    <p className="font-medium text-foreground">{course.name} ({course.code})</p>
                    <p className="text-sm text-muted-foreground">Docente: {course.instructor}</p>
                  </Label>
                </div>
              ))
            ) : (
                <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-3">
                    <BookOpen className="h-10 w-10 text-muted-foreground/50"/>
                    <span>No hay cursos disponibles para este grado.</span>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button onClick={handleSaveEnrollment} disabled={isSaving || isEnrolled}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? "Guardando..." : "Guardar Matrícula"}
            </Button>
            {isEnrolled && (
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Ficha
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
