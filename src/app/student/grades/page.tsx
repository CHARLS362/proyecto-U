
'use client';

import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { Award, Printer, FileDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { mockStudentGrades } from '@/lib/mockData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function StudentGradesPage() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const studentGrades = mockStudentGrades;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Reporte de Calificaciones - Año " + selectedYear, 14, 16);
    doc.setFontSize(12);
    doc.text("Estudiante: Ana Pérez", 14, 22);

    let startY = 30;

    studentGrades.forEach(bimesterData => {
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`Bimestre ${bimesterData.bimester}`, 14, startY);
      startY += 2;

      (doc as any).autoTable({
        startY: startY,
        head: [['Curso', 'Código', 'Nota Final']],
        body: bimesterData.grades.map(g => [g.courseName, g.courseCode, g.finalGrade]),
        theme: 'grid',
        headStyles: { fillColor: [33, 150, 243] },
      });
      
      startY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Promedio del Bimestre: ${bimesterData.average.toFixed(2)}`, 14, startY);
      startY += 15;
    });

    doc.save(`reporte_calificaciones_${selectedYear}.pdf`);
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
      <div className="space-y-6">
        <div className="no-print">
            <PageTitle title="Mis Calificaciones" subtitle="Consulta tu reporte de notas por bimestre." icon={Award}>
                <div className="flex items-center gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar Año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">Año Académico 2024</SelectItem>
                            <SelectItem value="2023">Año Académico 2023</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                    <Button onClick={handleExportPDF}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Exportar a PDF
                    </Button>
                </div>
            </PageTitle>
        </div>

        <div id="printable-area" className="space-y-8">
            <div className="print:block hidden text-center mb-8">
                <h1 className="text-2xl font-bold">Reporte de Calificaciones</h1>
                <p className="text-lg">Estudiante: Ana Pérez</p>
                <p className="text-md">Año Académico: {selectedYear}</p>
            </div>
          {studentGrades.map((bimesterData) => (
             <Card key={bimesterData.bimester} className="shadow-lg animate-fade-in print:shadow-none print:border-none">
              <CardHeader>
                <CardTitle>Bimestre {bimesterData.bimester}</CardTitle>
                <CardDescription>Calificaciones finales del período.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="text-center font-bold text-primary">Nota Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bimesterData.grades.map((grade) => (
                       <TableRow key={grade.courseCode}>
                        <TableCell className="font-medium">{grade.courseName}</TableCell>
                        <TableCell className="text-muted-foreground">{grade.courseCode}</TableCell>
                        <TableCell className={`text-center font-bold text-lg ${grade.finalGrade < 11 ? 'text-destructive' : 'text-foreground'}`}>
                            {grade.finalGrade}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator className="my-4" />
                <div className="text-right">
                    <p className="text-md font-semibold text-foreground">
                        Promedio del Bimestre: <span className="text-primary text-lg">{bimesterData.average.toFixed(2)}</span>
                    </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
