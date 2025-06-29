
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
  ListOrdered,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentsPage() {
  const router = useRouter();
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Estudiantes" subtitle="Agregue, vea o edite la información de los estudiantes." icon={Users} />

      <Tabs defaultValue="mostrar" className="w-full animate-fade-in">
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

        <TabsContent value="mostrar" className="mt-6 space-y-6">
           <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Lista de estudiantes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="class">Clase</Label>
                   <Select>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Seleccionar Clase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                      <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                      <SelectItem value="10-arte">10 (Arte)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Sección</Label>
                  <Select>
                    <SelectTrigger id="section">
                      <SelectValue placeholder="Seleccionar Sección" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full md:w-auto">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Encontrar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Lista de estudiantes</CardTitle>
                  </div>
                 <div className="flex w-full sm:w-auto items-center gap-2">
                    <Input
                      placeholder="Buscar..."
                      className="w-full sm:w-auto bg-card"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Button>
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Identificación de estudiante</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{index + 1}.</TableCell>
                      <TableCell className="text-muted-foreground">{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                           <span className="font-medium text-foreground">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <Edit className="mr-1 h-3 w-3" /> Editar
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-1 h-3 w-3" /> Borrar
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
                <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary">1</Button>
                    <Button variant="outline" size="sm">próximo</Button>
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
