
import { PageTitle } from "@/components/common/PageTitle";
import { mockStudents } from "@/lib/mockData";
import type { Student } from "@/lib/mockData";
import { Users, PlusCircle, Mail, Phone, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// This would typically be a client component if search/filter is interactive client-side
// For now, keeping it simple as a server component.
export default function StudentsPage() {
  // In a real app, searchParams would be used for server-side filtering
  // const search = searchParams?.search || ""; 
  // const filteredStudents = mockStudents.filter(student => 
  //   student.name.toLowerCase().includes(search.toLowerCase())
  // );
  const students = mockStudents;

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Estudiantes" subtitle={`Total de ${students.length} estudiantes registrados.`} icon={Users}>
         {/* <div className="flex items-center gap-2">
          <Input placeholder="Buscar estudiante..." className="max-w-xs bg-card"/>
        </div> TODO: Implement search functionality */}
        <Button asChild>
          <Link href="/students/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Estudiante
          </Link>
        </Button>
      </PageTitle>

      {students.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No hay estudiantes registrados</CardTitle>
            <CardDescription>Comience agregando un nuevo estudiante.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/students/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Estudiante
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {students.map((student) => (
            <Card key={student.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-from-left">
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-2 border-2 border-primary">
                  <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
                  <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{student.name}</CardTitle>
                <CardDescription>{student.gradeLevel}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{student.courses.length} cursos</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/students/${student.id}`}>Ver Perfil</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
