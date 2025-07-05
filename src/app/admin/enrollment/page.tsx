'use client';

import { useState, useMemo } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { 
  ClipboardEdit, 
  Search, 
  User, 
  Book, 
  Printer, 
  Save,
  CheckCircle,
  Loader2
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);

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
      const results = mockStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      if (results.length === 0) {
        toast({ title: "Sin resultados", description: "No se encontraron estudiantes." });
      }
      setIsSearching(false);
      setSelectedStudent(null); // Clear previous selection on new search
    }, 500);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    // By not clearing searchResults, we prevent the component from being removed abruptly.
    // It will be hidden by the conditional logic in the JSX.
    setSearchTerm(`${student.name} (${student.id})`);
    setIsEnrolled(false);
    // Pre-select courses the student is already enrolled in
    const enrolledCourseIds = new Set(student.courses.map(c => c.id));
    setSelectedCourses(enrolledCourseIds);
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
    
    // In a real app, you would send this to the backend
    console.log(`Matriculando a ${selectedStudent.name} en los cursos:`, Array.from(selectedCourses));
    
    toast({
      title: "Matrícula Guardada",
      description: `El estudiante ${selectedStudent.name} ha sido matriculado en ${selectedCourses.size} cursos.`,
      variant: "success"
    });
    setIsEnrolled(true);
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
              {isSearching ? <Loader2 className="animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Buscar
            </Button>
            {selectedStudent && (
                <Button variant="outline" onClick={resetSelection}>Limpiar</Button>
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
            {availableCourses.map(course => (
              <div key={course.id} className="flex items-center space-x-3 p-3 border rounded-md bg-card hover:bg-muted/50">
                <Checkbox 
                    id={`course-${course.id}`}
                    checked={selectedCourses.has(course.id)}
                    onCheckedChange={() => handleCourseToggle(course.id)}
                />
                <Label htmlFor={`course-${course.id}`} className="flex-1 cursor-pointer">
                  <p className="font-medium text-foreground">{course.name} ({course.code})</p>
                  <p className="text-sm text-muted-foreground">Docente: {course.instructor}</p>
                </Label>
              </div>
            ))}
            {availableCourses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No hay cursos disponibles para este grado.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleSaveEnrollment}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Matrícula
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
