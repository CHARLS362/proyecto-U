
'use client';

import { useState } from "react";
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
  Database,
  Printer,
  FileDown
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
import { useToast } from "@/hooks/use-toast";
import { mockGradesReport, type GradesReport } from "@/lib/mockData";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function QualificationsPage() {
  const { toast } = useToast();
  const [isEnteringGrades, setIsEnteringGrades] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSession, setSelectedSession] = useState('2024-25');
  const [reportData, setReportData] = useState<GradesReport | null>(null);


  const subjects = [
    { id: 1, name: "Hindi" },
    { id: 2, name: "Inglés" },
    { id: 3, name: "Matemáticas" },
    { id: 4, name: "Ciencias" },
    { id: 5, name: "Comercio" },
  ];

  const handleContinue = () => {
    setIsDialogOpen(false);
    setIsEnteringGrades(true);
    toast({ title: "Información Cargada", description: "Ahora ingrese las notas de los estudiantes.", variant: "info" });
  };

  const handleBack = () => {
    setIsEnteringGrades(false);
  };

  const handleSearchReport = () => {
    if (!selectedClass) {
        toast({
            title: "Filtro Incompleto",
            description: "Por favor, seleccione una clase para generar el reporte.",
            variant: "destructive"
        });
        return;
    }
    // Simulate fetching data based on filters
    const report = mockGradesReport[selectedClass];
    setReportData(report || null);
    
    toast({
        title: "Reporte Generado",
        description: report ? `Mostrando reporte para la clase ${report.className}.` : "No se encontraron datos para la selección.",
        variant: "info",
    });
  };

  const handleExportPDF = () => {
    if (!reportData) {
      toast({
        title: "No hay datos para exportar",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const tableHead = [["#", "Estudiante", ...reportData.subjects]];
    const tableBody = reportData.grades.map((grade, index) => [
      index + 1,
      grade.studentName,
      ...grade.scores.map(score => score?.toString() ?? 'N/A')
    ]);

    doc.setFontSize(18);
    doc.text(`Reporte de Calificaciones - ${reportData.className}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Sesión: ${selectedSession} | Sección: ${selectedSection}`, 14, 28);
    
    (doc as any).autoTable({
      head: tableHead,
      body: tableBody,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243] }
    });

    doc.save(`reporte_${reportData.className.replace(/\s/g, '_')}.pdf`);
  };
  
  const UploadDialog = () => (
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
            <Label htmlFor="class-select">Clase</Label>
            <Select defaultValue="5-sec">
              <SelectTrigger id="class-select"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3-sec">3º de Secundaria</SelectItem>
                <SelectItem value="4-sec">4º de Secundaria</SelectItem>
                <SelectItem value="5-sec">5º de Secundaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="section-select">Seccion</Label>
              <Select defaultValue="A">
              <SelectTrigger id="section-select"><SelectValue /></SelectTrigger>
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
            <Label htmlFor="subject-select">Sujeto</Label>
            <Select>
              <SelectTrigger id="subject-select"><SelectValue placeholder="--select--" /></SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name.toLowerCase()}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleContinue}>
          Continuar <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Calificaciones" icon={Award} />
      
      <Tabs defaultValue="ver-calificaciones" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="subir-calificaciones">Subir calificaciones</TabsTrigger>
          <TabsTrigger value="ver-calificaciones">Reporte de Calificaciones</TabsTrigger>
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
            </Card>
          ) : (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Ingresar Notas</CardTitle>
                </div>
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atrás
                </Button>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-foreground">Clase 12c A - Examen Final de Comercio</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Puntuación total</TableHead>
                      <TableHead className="text-center">Nota Obtenida</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1.</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="Estudiante" data-ai-hint="student avatar" />
                            <AvatarFallback>AP</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">Ana Pérez</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">20</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" min="0" max="20" placeholder="--" className="w-24 mx-auto" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end pt-4 mt-4 border-t">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => toast({ title: "Notas Guardadas", description: "Las calificaciones han sido registradas.", variant: 'success'})}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Notas
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
                  <CardTitle className="text-lg">Filtros del Reporte</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="view-class">Clase</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger id="view-class"><SelectValue placeholder="-- Seleccionar --"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-sec">3º de Secundaria</SelectItem>
                        <SelectItem value="4-sec">4º de Secundaria</SelectItem>
                        <SelectItem value="5-sec">5º de Secundaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="view-section">Sección</Label>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger id="view-section"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="view-session">Sesión</Label>
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                      <SelectTrigger id="view-session"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full md:w-auto" onClick={handleSearchReport}>
                    <Search className="mr-2 h-4 w-4" />
                    Generar Reporte
                  </Button>
                </div>
              </CardContent>
            </Card>

            {reportData && (
              <Card className="shadow-lg animate-fade-in">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Reporte: {reportData.className}</CardTitle>
                    <p className="text-sm text-muted-foreground">Mostrando {reportData.grades.length} estudiantes.</p>
                  </div>
                  <Button onClick={handleExportPDF}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar a PDF
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Estudiante</TableHead>
                        {reportData.subjects.map(subject => (
                          <TableHead key={subject} className="text-center">{subject}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.grades.map((grade, index) => (
                        <TableRow key={grade.studentId}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{grade.studentName}</TableCell>
                          {grade.scores.map((score, scoreIndex) => (
                            <TableCell key={scoreIndex} className={`text-center font-medium ${score !== null && score < 11 ? 'text-destructive' : ''}`}>
                              {score ?? '--'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {!reportData && (
              <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-accent/20 rounded-full mb-4">
                    <Database className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Sin reporte para mostrar</h3>
                  <p className="text-sm text-muted-foreground">Seleccione los filtros y genere un reporte.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
