
import { PageTitle } from "@/components/common/PageTitle";
import { mockAttendance, mockStudents, mockCourses } from "@/lib/mockData";
import type { AttendanceRecord } from "@/lib/mockData";
import { ClipboardCheck, PlusCircle, Filter, Download } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/common/DatePickerWithRange"; // Assume this component exists

// Helper to get badge variant based on status
const getAttendanceBadgeVariant = (status: AttendanceRecord["status"]): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "Presente":
      return "default"; // Or a success-like variant if available
    case "Ausente":
      return "destructive";
    case "Tarde":
      return "outline"; // Orange-like or warning
    case "Justificado":
      return "secondary";
    default:
      return "secondary";
  }
};

export default function AttendancePage() {
  const attendanceRecords = mockAttendance;

  return (
    <div className="space-y-6">
      <PageTitle title="Registro de Asistencia" subtitle="Visualice y gestione la asistencia de los estudiantes." icon={ClipboardCheck}>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Registrar Asistencia
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </PageTitle>

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Registros de Asistencia</CardTitle>
              <CardDescription>Filtre para ver registros específicos.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* TODO: DatePickerWithRange is not implemented yet. Placeholder.*/}
              {/* <DatePickerWithRange className="w-full sm:w-auto" /> */}
              <Button variant="outline" className="w-full sm:w-auto bg-card">
                <Filter className="mr-2 h-4 w-4" /> Filtrar Fechas
              </Button>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px] bg-card">
                  <SelectValue placeholder="Filtrar por Curso" />
                </SelectTrigger>
                <SelectContent>
                  {mockCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select>
                <SelectTrigger className="w-full sm:w-[180px] bg-card">
                  <SelectValue placeholder="Filtrar por Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presente">Presente</SelectItem>
                  <SelectItem value="Ausente">Ausente</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Justificado">Justificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No hay registros de asistencia</p>
              <p className="text-sm text-muted-foreground">Comience registrando la asistencia de los estudiantes.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Link href={`/students/${record.studentId}`} className="font-medium text-foreground hover:underline">
                        {record.studentName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/courses/${record.courseId}`} className="text-sm text-muted-foreground hover:underline">
                        {record.courseName}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('es-ES', {day: '2-digit', month: 'short', year: 'numeric'})}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getAttendanceBadgeVariant(record.status)}>{record.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
         {attendanceRecords.length > 0 && (
          <CardFooter className="py-4 border-t">
            <p className="text-sm text-muted-foreground">Mostrando {attendanceRecords.length} registros.</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

