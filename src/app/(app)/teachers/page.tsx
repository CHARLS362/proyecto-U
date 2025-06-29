
'use client';

import { useState } from 'react';
import { Users, Filter, UserPlus, ListOrdered, Search as SearchIcon, Edit, Trash2, UsersRound, Hourglass, FileText as NoLeavesIcon, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialTeachers = [
  {
    id: "T1749005331",
    name: "Arnold apd",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "T1749005332",
    name: "Beatriz Castillo",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "T1749005333",
    name: "Carlos Dávila",
    avatarUrl: "https://placehold.co/40x40.png",
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) {
      setNotification({ type: 'error', message: 'Por favor, ingresa el nombre.' });
      return;
    }

    // Genera datos mínimos válidos para la API
    const fakeId = `T${Date.now()}`;
    const body = {
      identificador: fakeId,
      nombre: newTeacherName,
      apellido: '---',
      padre: null,
      asignatura_id: 1,
      genero: 'otro',
      fecha_nacimiento: '2000-01-01',
      imagen: 'default_user.png',
      telefono: '0000000000',
      correo: `${fakeId}@mail.com`,
      direccion: '---',
      ciudad: '---',
      codigo_postal: '00000',
      estado: '---',
      clase_id: 1,
    };

    try {
      const response = await fetch('/api/maestros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: 'Maestro agregado correctamente.' });
        setTeachers(prev => [
          ...prev,
          {
            id: fakeId,
            name: newTeacherName,
            avatarUrl: "https://placehold.co/40x40.png",
          }
        ]);
        setNewTeacherName('');
        setIsAddTeacherOpen(false);
      } else {
        setNotification({ type: 'error', message: data.error || 'Error al agregar maestro.' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error de red o del servidor.' });
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded shadow-lg text-base font-medium
            ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          style={{ transform: 'translateX(-50%)' }}
        >
          {notification.message}
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight animate-fade-in">
        Maestro
      </h1>

      <Tabs defaultValue="agregar" className="w-full animate-fade-in" style={{animationDelay: '100ms'}}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:max-w-lg">
          <TabsTrigger value="agregar">Agregar profesor</TabsTrigger>
          <TabsTrigger value="mostrar">Mostrar profesores</TabsTrigger>
          <TabsTrigger value="historial">Los profesores se van</TabsTrigger>
        </TabsList>

        <TabsContent value="agregar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl">Profesores</CardTitle>
              </div>
              <Button variant="ghost" size="icon" aria-label="Filtrar profesores">
                <Filter className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-primary/50"
                    >
                      <div className="bg-green-100 dark:bg-green-500/20 p-5 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-500/30 transition-colors">
                        <UserPlus className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        Agregar Maestro
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Maestro</DialogTitle>
                      <DialogDescription>
                        Complete el nombre del nuevo maestro. El ID se generará automáticamente.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTeacher}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="name"
                            value={newTeacherName}
                            onChange={(e) => setNewTeacherName(e.target.value)}
                            className="col-span-3"
                            placeholder="Ej: Juan Pérez"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddTeacherOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar Maestro</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-purple-500/50"
                >
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-5 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-colors">
                    <UserCog className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                    Gestionar Estado
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mostrar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ListOrdered className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Lista de profesores</CardTitle>
              </div>
              <div className="relative w-full sm:w-auto sm:max-w-xs">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nombre..." 
                  className="bg-card w-full pl-9"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Identificación del profesor</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher, index) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint="teacher avatar" />
                            <AvatarFallback>{teacher.name.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          {teacher.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600">
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
              {filteredTeachers.length === 0 && (
                <p className="p-6 text-center text-muted-foreground">
                  No se encontraron profesores.
                </p>
              )}
            </CardContent>
            {filteredTeachers.length > 0 && (
                <CardFooter className="flex justify-end items-center gap-2 pt-4">
                    <Button variant="outline" size="sm">anterior</Button>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary">1</Button>
                    <Button variant="outline" size="sm">próximo</Button>
                </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Los Profesores Que Se Van</CardTitle>
              <CardDescription>Gestión de licencias y hojas de los profesores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SimpleMetricCard
                  title="Total de profesores"
                  value="1"
                  icon={UsersRound}
                  iconBgClass="bg-blue-100 dark:bg-blue-500/30"
                  iconColorClass="text-blue-500 dark:text-blue-300"
                />
                <SimpleMetricCard
                  title="Licencias Aprobadas"
                  value="0"
                  icon={Hourglass}
                  iconBgClass="bg-green-100 dark:bg-green-500/30"
                  iconColorClass="text-green-500 dark:text-green-300"
                />
                <SimpleMetricCard
                  title="Hojas pendientes"
                  value="0"
                  icon={Hourglass}
                  iconBgClass="bg-yellow-100 dark:bg-yellow-500/30"
                  iconColorClass="text-yellow-500 dark:text-yellow-300"
                />
                <SimpleMetricCard
                  title="Hojas rechazadas"
                  value="0"
                  icon={Hourglass}
                  iconBgClass="bg-red-100 dark:bg-red-500/30"
                  iconColorClass="text-red-500 dark:text-red-300"
                />
              </section>

              <Tabs defaultValue="pendientes" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:max-w-md bg-background p-1 rounded-md">
                  <TabsTrigger 
                    value="pendientes" 
                    className="rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    Hojas pendientes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="aprobadas"
                    className="rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    Licencias Aprobadas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rechazadas"
                    className="rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    Hojas rechazadas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pendientes" className="mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-2 border-b font-medium text-sm text-muted-foreground items-center">
                      <div className="md:col-span-1">NOMBRE DEL PERSONAL</div>
                      <div className="md:col-span-1">TIPO DE LICENCIA</div>
                      <div className="md:col-span-1">FECHA DE SOLICITUD</div>
                      <div className="md:col-span-1">RANGO DE FECHAS</div>
                      <div className="md:col-span-1 text-right">ACCIÓN</div>
                    </div>
                    <div className="text-center py-12">
                      <NoLeavesIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium text-muted-foreground">Sin hojas</p>
                      <p className="text-sm text-muted-foreground">No hay hojas pendientes para mostrar.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="aprobadas" className="mt-6">
                   <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-2 border-b font-medium text-sm text-muted-foreground items-center">
                      <div className="md:col-span-1">NOMBRE DEL PERSONAL</div>
                      <div className="md:col-span-1">TIPO DE LICENCIA</div>
                      <div className="md:col-span-1">FECHA DE SOLICITUD</div>
                      <div className="md:col-span-1">RANGO DE FECHAS</div>
                      <div className="md:col-span-1 text-right">ACCIÓN</div>
                    </div>
                    <div className="text-center py-12">
                      <NoLeavesIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium text-muted-foreground">Sin hojas</p>
                      <p className="text-sm text-muted-foreground">No hay licencias aprobadas para mostrar.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="rechazadas" className="mt-6">
                   <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 pb-2 border-b font-medium text-sm text-muted-foreground items-center">
                      <div className="md:col-span-1">NOMBRE DEL PERSONAL</div>
                      <div className="md:col-span-1">TIPO DE LICENCIA</div>
                      <div className="md:col-span-1">FECHA DE SOLICITUD</div>
                      <div className="md:col-span-1">RANGO DE FECHAS</div>
                      <div className="md:col-span-1 text-right">ACCIÓN</div>
                    </div>
                    <div className="text-center py-12">
                      <NoLeavesIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
                      <p className="mt-4 text-lg font-medium text-muted-foreground">Sin hojas</p>
                      <p className="text-sm text-muted-foreground">No hay hojas rechazadas para mostrar.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}