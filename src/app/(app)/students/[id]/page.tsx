
import { PageTitle } from "@/components/common/PageTitle";
import { mockStudents, mockCourses } from "@/lib/mockData";
import type { Student } from "@/lib/mockData";
import { User, Mail, Phone, MapPin, CalendarDays, ShieldCheck, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

async function getStudent(id: string): Promise<Student | undefined> {
  return mockStudents.find(s => s.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);
  if (!student) {
    return { title: "Estudiante no encontrado" };
  }
  return { title: `Perfil de ${student.name}` };
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle title={student.name} subtitle={`Perfil del Estudiante - ${student.gradeLevel}`} icon={User}>
        <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar Perfil
        </Button>
        <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-primary shadow-md">
              <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student photo" />
              <AvatarFallback className="text-4xl">{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <CardDescription>{student.id} &bull; {student.gradeLevel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{student.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{student.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <span className="text-foreground">{student.address}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">Inscrito: {new Date(student.enrollmentDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {student.guardianName && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">Tutor: {student.guardianName} ({student.guardianContact})</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Cursos Inscritos</CardTitle>
            <CardDescription>Progreso y detalles de los cursos actuales del estudiante.</CardDescription>
          </CardHeader>
          <CardContent>
            {student.courses.length > 0 ? (
              <div className="space-y-6">
                {student.courses.map(course => {
                  const courseDetails = mockCourses.find(c => c.id === course.id);
                  return (
                    <div key={course.id} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-md text-primary">{course.name}</h4>
                        {courseDetails && <Badge variant="outline">{courseDetails.code}</Badge>}
                      </div>
                      {courseDetails && <p className="text-xs text-muted-foreground mb-1">Profesor: {courseDetails.instructor}</p>}
                      <div className="flex items-center gap-2">
                        <Progress value={course.progress} className="w-full h-2.5" />
                        <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                      </div>
                      <Button variant="link" size="sm" asChild className="px-0 mt-1">
                        <Link href={`/courses/${course.id}`}>Ver detalles del curso</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">Este estudiante no está inscrito en ningún curso.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Historial de Asistencia Reciente</CardTitle>
        </CardHeader>
        <CardContent>
           {/* For now, a placeholder. This would query mockAttendance based on student.id */}
           <p className="text-muted-foreground">El historial de asistencia se mostrará aquí.</p>
           {/* Example structure if data was available:
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Matemáticas Avanzadas</TableCell>
                <TableCell>2024-05-01</TableCell>
                <TableCell><Badge variant="default">Presente</Badge></TableCell>
              </TableRow>
            </TableBody>
           </Table>
           */}
        </CardContent>
      </Card>
    </div>
  );
}
