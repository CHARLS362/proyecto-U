
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Filter,
  UserPlus,
  UserMinus,
  Search as SearchIcon,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageTitle } from '@/components/common/PageTitle';
import { mockStudents } from '@/lib/mockData';
import type { Student } from '@/lib/mockData';

export default function StudentsPage() {
  const router = useRouter();
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Estudiantes" subtitle="Agregue, vea o edite la información de los estudiantes." icon={Users} />

      <Tabs defaultValue="agregar" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="agregar">Agregar estudiantes</TabsTrigger>
          <TabsTrigger value="mostrar">Mostrar estudiantes</TabsTrigger>
          <TabsTrigger value="comentario">Comentario</TabsTrigger>
        </TabsList>

        <TabsContent value="agregar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-xl">Estudiantes</CardTitle>
              </div>
              <Button variant="ghost" size="icon" aria-label="Filtrar estudiantes">
                <Filter className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-start space-x-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border bg-card hover:bg-muted/50 text-foreground"
                  onClick={() => router.push('/students/new')}
                >
                  <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                    <UserPlus className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-semibold">
                    Agregar Alumno
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 flex items-center justify-start space-x-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border bg-card hover:bg-muted/50 text-foreground"
                >
                  <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
                    <UserMinus className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-lg font-semibold">
                    Eliminar Alumno
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mostrar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <CardTitle className="text-xl">Lista de Estudiantes</CardTitle>
                  </div>
                 <div className="flex w-full sm:w-auto items-center gap-2">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Buscar por nombre..."
                        className="w-full sm:w-[200px] lg:w-[250px] bg-card pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => router.push('/students/new')}>
                      <UserPlus className="mr-2 h-4 w-4" /> Agregar
                    </Button>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Grado</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student photo" />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                           <Link href={`/students/${student.id}`} className="font-medium text-foreground hover:underline">
                            {student.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{student.id}</TableCell>
                      <TableCell className="text-muted-foreground">{student.gradeLevel}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Eliminar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredStudents.length === 0 && (
                <p className="p-6 text-center text-muted-foreground">
                  No se encontraron estudiantes.
                </p>
              )}
            </CardContent>
             {filteredStudents.length > 0 && (
                <CardFooter className="flex justify-between items-center py-4 border-t">
                    <p className="text-sm text-muted-foreground">Mostrando {filteredStudents.length} de {students.length} estudiantes.</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Anterior</Button>
                      <Button variant="outline" size="sm">Siguiente</Button>
                    </div>
                </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="comentario" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Comentarios</CardTitle>
              <CardDescription>
                Deje comentarios o notas sobre los estudiantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">La funcionalidad de comentarios se mostrará aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

