
import { PageTitle } from "@/components/common/PageTitle";
import { mockCourses } from "@/lib/mockData";
import type { Course } from "@/lib/mockData";
import { BookOpenText, PlusCircle, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CoursesPage() {
  const courses = mockCourses;

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Cursos" subtitle={`Total de ${courses.length} cursos disponibles.`} icon={BookOpenText}>
        <Button asChild>
          <Link href="/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Curso
          </Link>
        </Button>
      </PageTitle>

      {courses.length === 0 ? (
         <Card className="text-center py-12">
          <CardHeader>
            <BookOpenText className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No hay cursos registrados</CardTitle>
            <CardDescription>Comience agregando un nuevo curso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/courses/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Curso
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
      <Card className="shadow-lg animate-fade-in">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre del Curso</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead className="text-center">Créditos</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-primary">{course.code}</TableCell>
                  <TableCell>
                    <Link href={`/courses/${course.id}`} className="font-medium text-foreground hover:underline">
                      {course.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{course.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={course.instructorAvatar} alt={course.instructor} data-ai-hint="instructor avatar" />
                        <AvatarFallback>{course.instructor.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{course.instructor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.department}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{course.credits}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span>{course.enrolledStudentsCount}/{course.capacity}</span>
                      <Progress value={(course.enrolledStudentsCount / course.capacity) * 100} className="h-1.5 w-16 mt-1" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}`}>Ver Detalles</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Gestionar Estudiantes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                          Eliminar Curso
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
