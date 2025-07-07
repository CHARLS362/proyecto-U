
import { PageTitle } from "@/components/common/PageTitle";
import { mockCourses, mockStudents } from "@/lib/mockData";
import { BookOpenText, Users, Clock, CalendarDays, BarChart, UserCircle, Edit, Trash2, User, ChevronLeft, ListOrdered, School } from "lucide-react";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

async function getCourse(id: string) {
  return mockCourses.find(c => c.id === id);
}

function getEnrolledStudents(courseId: string) {
    return mockStudents.filter(student => student.courses.some(course => course.id === courseId));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) {
    return { title: "Curso no encontrado" };
  }
  return { title: `Detalles de ${course.name}` };
}

export default async function CourseProfilePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  const enrolledStudents = getEnrolledStudents(course.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle title={course.name} subtitle={`Código del Curso: ${course.code}`} icon={BookOpenText}>
        <Button variant="outline" asChild>
          <Link href="/admin/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a Cursos
          </Link>
        </Button>
        <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Editar Curso
        </Button>
        <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </Button>
      </PageTitle>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Información Principal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">{course.description}</p>
                    <Separator />
                     <div className="flex items-center gap-3">
                        <School className="h-5 w-5 text-primary"/>
                        <span className="font-medium">Nivel:</span>
                        <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <UserCircle className="h-5 w-5 text-primary"/>
                        <span className="font-medium">Instructor:</span>
                        <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <BookOpenText className="h-5 w-5 text-primary"/>
                        <span className="font-medium">Departamento:</span>
                        <span>{course.department}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary"/>
                        <span className="font-medium">Horario:</span>
                        <span>{course.schedule}</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Estudiantes Inscritos ({enrolledStudents.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>ID de Estudiante</TableHead>
                        <TableHead>Nivel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrolledStudents.map(student => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
                                        <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <Link href={`/admin/students/${student.id}`} className="font-medium text-foreground hover:underline">
                                        {student.name}
                                    </Link>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{student.id}</TableCell>
                            <TableCell><Badge variant="outline">{student.gradeLevel}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {enrolledStudents.length === 0 && (
                <div className="text-center p-10 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-2" />
                    <p>No hay estudiantes inscritos en este curso.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
