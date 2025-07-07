
'use client';

import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Award, 
  Search, 
  Database,
  Printer,
  FileDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { mockGradesReport, type GradesReport } from "@/lib/mockData";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


// This is required for jspdf-autotable to work with jsPDF's TypeScript types
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
      lastAutoTable: { finalY: number };
    }
}

// Define grade options
const primaryGrades = [
  { value: '1-pri', label: '1º de Primaria' },
  { value: '2-pri', label: '2º de Primaria' },
  { value: '3-pri', label: '3º de Primaria' },
  { value: '4-pri', label: '4º de Primaria' },
  { value: '5-pri', label: '5º de Primaria' },
  { value: '6-pri', label: '6º de Primaria' },
];

const secondaryGrades = [
  { value: '3-sec', label: '3º de Secundaria' },
  { value: '4-sec', label: '4º de Secundaria' },
  { value: '5-sec', label: '5º de Secundaria' },
];

export default function QualificationsPage() {
  const { toast } = useToast();
  
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSession, setSelectedSession] = useState('2024-25');
  const [reportData, setReportData] = useState<GradesReport | null>(null);

  const handleSearchReport = () => {
    if (!selectedGrade) {
        toast({
            title: "Filtro Incompleto",
            description: "Por favor, seleccione nivel y grado para generar el reporte.",
            variant: "destructive"
        });
        return;
    }
    const report = mockGradesReport[selectedGrade];
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
  
  const handlePrint = () => {
      window.print();
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Reporte de Calificaciones" subtitle="Genere reportes de calificaciones consolidados por clase." icon={Award}>
          <div className="flex items-center gap-2">
            {reportData && (
                <>
                <Button variant="outline" onClick={handlePrint} className="no-print">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
                <Button onClick={handleExportPDF} className="no-print">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar a PDF
                </Button>
                </>
            )}
          </div>
      </PageTitle>

      <Card className="shadow-lg no-print">
        <CardHeader>
          <CardTitle className="text-lg">Filtros del Reporte</CardTitle>
          <CardDescription>Seleccione los parámetros para generar el reporte de una clase específica.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="level-select">Nivel</Label>
              <Select value={selectedLevel} onValueChange={(value) => {
                  setSelectedLevel(value);
                  setSelectedGrade(''); // Reset grade when level changes
                  setReportData(null);
              }}>
                <SelectTrigger id="level-select"><SelectValue placeholder="-- Nivel --"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primaria">Primaria</SelectItem>
                  <SelectItem value="secundaria">Secundaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade-select">Grado</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={!selectedLevel}>
                <SelectTrigger id="grade-select"><SelectValue placeholder={!selectedLevel ? "Seleccione nivel" : "-- Grado --"} /></SelectTrigger>
                <SelectContent>
                  {selectedLevel === 'primaria' && primaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                  {selectedLevel === 'secundaria' && secondaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="section-select">Sección</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger id="section-select"><SelectValue placeholder="-- Sección --"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="session-select">Sesión</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger id="session-select"><SelectValue placeholder="-- Sesión --"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full lg:w-auto" onClick={handleSearchReport}>
              <Search className="mr-2 h-4 w-4" />
              Generar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div id="report-printable-area">
        {reportData ? (
          <Card className="shadow-lg animate-fade-in mt-6 print-container">
             <div className="print:block hidden text-center mb-4">
                <h2 className="text-xl font-bold">Reporte de Calificaciones</h2>
                <p className="text-md">Clase: {reportData.className} - Sección {selectedSection} | Sesión: {selectedSession}</p>
            </div>
            <CardHeader className="flex flex-row justify-between items-center print:hidden">
              <div>
                <CardTitle className="text-xl">Reporte: {reportData.className}</CardTitle>
                <CardDescription>Mostrando {reportData.grades.length} estudiantes.</CardDescription>
              </div>
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
        ) : (
          <Card className="shadow-lg mt-6">
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

       <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #report-printable-area, #report-printable-area * {
                visibility: visible;
            }
            #report-printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none;
            }
            .print-container {
                border: none !important;
                box-shadow: none !important;
            }
        }
      `}</style>
    </div>
  );
}
