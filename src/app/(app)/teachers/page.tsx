
'use client';

import { useState } from 'react';
import { Users, Filter, UserPlus, ListOrdered, Search as SearchIcon, Edit, Trash2, UsersRound, Hourglass, FileText as NoLeavesIcon, UserCog, ChevronRight, ChevronsUpDown, Check } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';


interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  status: 'Activo' | 'Inactivo';
  class?: string;
  section?: string;
  relatedSubject?: string;
  gender?: string;
  dob?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  refContact?: string;
  refRelationship?: string;
}


const initialTeachers: Teacher[] = [
  {
    id: "T1749005331",
    firstName: "Arnold",
    lastName: "Apd",
    avatarUrl: "https://placehold.co/40x40.png",
    email: "arnold.apd@example.com",
    phoneNumber: "111-222-3333",
    address: "Calle Falsa 123, Ciudad",
    dob: "1985-05-20",
    gender: "masculino",
    class: "12-comercio",
    section: "A",
    relatedSubject: "Física",
    refContact: "555-123-4567",
    refRelationship: "Esposa",
    status: 'Activo',
  },
  {
    id: "T1749005332",
    firstName: "Beatriz",
    lastName: "Castillo",
    avatarUrl: "https://placehold.co/40x40.png",
    email: "beatriz.castillo@example.com",
    phoneNumber: "222-333-4444",
    address: "Avenida Siempreviva 742, Ciudad",
    dob: "1990-11-15",
    gender: "femenino",
    class: "11-ciencia",
    section: "B",
    relatedSubject: "Química",
    refContact: "555-234-5678",
    refRelationship: "Hermano",
    status: 'Activo',
  },
  {
    id: "T1749005333",
    firstName: "Carlos",
    lastName: "Dávila",
    avatarUrl: "https://placehold.co/40x40.png",
    email: "carlos.davila@example.com",
    phoneNumber: "333-444-5555",
    address: "Boulevard de los Sueños Rotos 45, Ciudad",
    dob: "1982-03-30",
    gender: "masculino",
    class: "10-arte",
    section: "C",
    relatedSubject: "Arte",
    refContact: "555-345-6789",
    refRelationship: "Padre",
    status: 'Activo',
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTeacherId, setCurrentTeacherId] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  
  // Form fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [teacherClass, setTeacherClass] = useState('');
  const [teacherSection, setTeacherSection] = useState('');
  const [relatedSubject, setRelatedSubject] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [refContact, setRefContact] = useState('');
  const [refRelationship, setRefRelationship] = useState('');

  // State for status management modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTeacherForStatus, setSelectedTeacherForStatus] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [statusSearchTerm, setStatusSearchTerm] = useState('');
  const [isTeacherListOpen, setIsTeacherListOpen] = useState(false);


  const resetForm = () => {
    setFormStep(1);
    setFirstName('');
    setLastName('');
    setTeacherClass('');
    setTeacherSection('');
    setRelatedSubject('');
    setGender('');
    setDob('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setRefContact('');
    setRefRelationship('');
    setCurrentTeacherId(null);
  };
  
  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      resetForm();
    }
  }
  
  const handleStatusModalChange = (open: boolean) => {
      setIsStatusModalOpen(open);
      if (!open) {
          setSelectedTeacherForStatus(null);
          setStatusSearchTerm('');
      }
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    resetForm();
    setModalMode('edit');
    setCurrentTeacherId(teacher.id);

    // Populate form state from teacher data
    setFirstName(teacher.firstName);
    setLastName(teacher.lastName);
    setTeacherClass(teacher.class || '');
    setTeacherSection(teacher.section || '');
    setRelatedSubject(teacher.relatedSubject || '');
    setGender(teacher.gender || '');
    setDob(teacher.dob || '');
    setPhoneNumber(teacher.phoneNumber || '');
    setEmail(teacher.email || '');
    setAddress(teacher.address || '');
    setRefContact(teacher.refContact || '');
    setRefRelationship(teacher.refRelationship || '');

    setFormStep(1);
    setIsModalOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teacherDataPayload = {
      firstName,
      lastName,
      avatarUrl: "https://placehold.co/40x40.png",
      class: teacherClass,
      section: teacherSection,
      relatedSubject,
      gender,
      dob,
      phoneNumber,
      email,
      address,
      refContact,
      refRelationship
    };

    if (modalMode === 'add') {
      const newTeacher: Teacher = {
        id: `T${Date.now()}`,
        status: 'Activo',
        ...teacherDataPayload
      };
      setTeachers(prev => [...prev, newTeacher]);
      console.log("Nuevo docente agregado (simulación):", newTeacher);
    } else if (currentTeacherId) {
       setTeachers(prev => 
            prev.map(t => 
                t.id === currentTeacherId 
                ? { ...t, ...teacherDataPayload } 
                : t
            )
        );
      console.log("Docente actualizado (simulación):", { id: currentTeacherId, ...teacherDataPayload });
    }
    
    handleModalChange(false);
  };

  const handleSelectTeacherForStatus = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
        setSelectedTeacherForStatus(teacher.id);
        setNewStatus(teacher.status);
    }
  };

  const handleStatusUpdate = () => {
    if (!selectedTeacherForStatus) return;
    setTeachers(prevTeachers =>
      prevTeachers.map(teacher =>
        teacher.id === selectedTeacherForStatus
          ? { ...teacher, status: newStatus }
          : teacher
      )
    );
    handleStatusModalChange(false);
  };


  const filteredTeachers = teachers.filter(teacher => 
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTeacherForStatusObject = teachers.find(t => t.id === selectedTeacherForStatus);
  const filteredTeachersForStatusModal = teachers.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(statusSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
                <Button
                  variant="outline"
                  onClick={handleOpenAddModal}
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-primary/50"
                >
                  <div className="bg-green-100 dark:bg-green-500/20 p-5 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-500/30 transition-colors">
                    <UserPlus className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Agregar Maestro
                  </span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleStatusModalChange(true)}
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
                    <TableHead>Estado</TableHead>
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
                            <AvatarImage src={teacher.avatarUrl} alt={`${teacher.firstName} ${teacher.lastName}`} data-ai-hint="teacher avatar" />
                            <AvatarFallback>{teacher.firstName.substring(0, 1)}{teacher.lastName.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          {`${teacher.firstName} ${teacher.lastName}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.status === 'Activo' ? 'secondary' : 'destructive'} className={cn(teacher.status === 'Activo' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300')}>
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600" onClick={() => handleOpenEditModal(teacher)}>
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

      <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="sm:max-w-lg">
          {formStep === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>{modalMode === 'add' ? 'Detalles del profesor' : 'Editar Detalles del Profesor'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="first-name" placeholder="Nombres" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    <Input id="last-name" placeholder="Apellidos" value={lastName} onChange={e => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Detalles del profesor de la clase</Label>
                   <div className="grid grid-cols-2 gap-4">
                      <Select onValueChange={setTeacherClass} value={teacherClass}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar Clase"/></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                              <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                              <SelectItem value="10-arte">10 (Arte)</SelectItem>
                          </SelectContent>
                      </Select>
                      <Select onValueChange={setTeacherSection} value={teacherSection}>
                          <SelectTrigger><SelectValue placeholder="Sección"/></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                      </Select>
                   </div>
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="related-subject">Tema relacionado</Label>
                   <Input id="related-subject" placeholder="Ej: Matemáticas" value={relatedSubject} onChange={e => setRelatedSubject(e.target.value)} />
                </div>
                 <div className="grid gap-2">
                   <Label htmlFor="gender">Género</Label>
                   <Select onValueChange={setGender} value={gender}>
                      <SelectTrigger id="gender"><SelectValue placeholder="Seleccionar género"/></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="dob">Fecha de nacimiento</Label>
                   <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-card"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setFormStep(2)}>
                  Próximo <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}
           {formStep === 2 && (
             <>
              <DialogHeader>
                <DialogTitle>Detalles de Contacto y Acceso</DialogTitle>
                <DialogDescription>
                  Esta información será utilizada para las credenciales de acceso del docente.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                      <div className="grid gap-2">
                          <Label htmlFor="phone">Número de celular</Label>
                          <Input id="phone" type="tel" placeholder="Ej: 987654321" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input id="email" type="email" placeholder="Ej: docente@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="address">Dirección</Label>
                          <Input id="address" placeholder="Ej: Av. Principal 123, Ciudad" value={address} onChange={e => setAddress(e.target.value)} />
                      </div>
                       <div className="grid gap-2">
                          <Label htmlFor="ref-contact">Contacto de referencia</Label>
                          <Input id="ref-contact" placeholder="Ej: 987654322" value={refContact} onChange={e => setRefContact(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="ref-relationship">Parentesco</Label>
                          <Input id="ref-relationship" placeholder="Ej: Esposa, Hermano, etc." value={refRelationship} onChange={e => setRefRelationship(e.target.value)} />
                      </div>
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setFormStep(1)}>Atrás</Button>
                      <Button type="submit">
                        {modalMode === 'add' ? 'Guardar Maestro' : 'Guardar Cambios'}
                      </Button>
                  </DialogFooter>
              </form>
             </>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isStatusModalOpen} onOpenChange={handleStatusModalChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gestionar Estado del Docente</DialogTitle>
            <DialogDescription>
              Busque un docente para cambiar su estado de 'Activo' a 'Inactivo' o viceversa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher-status-select">Docente</Label>
              <Popover open={isTeacherListOpen} onOpenChange={setIsTeacherListOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="teacher-status-select"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isTeacherListOpen}
                    className="w-full justify-between"
                  >
                    {selectedTeacherForStatusObject
                        ? `${selectedTeacherForStatusObject.firstName} ${selectedTeacherForStatusObject.lastName}`
                        : "Buscar un docente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <div className='p-2'>
                    <Input
                        placeholder="Buscar docente..."
                        value={statusSearchTerm}
                        onChange={(e) => setStatusSearchTerm(e.target.value)}
                        className="w-full"
                    />
                  </div>
                  <ScrollArea className="h-[200px]">
                    <div className="p-1">
                      {filteredTeachersForStatusModal.length > 0 ? (
                        filteredTeachersForStatusModal.map((teacher) => (
                          <Button
                              key={teacher.id}
                              variant="ghost"
                              className="w-full justify-start font-normal"
                              onClick={() => {
                                  handleSelectTeacherForStatus(teacher.id);
                                  setIsTeacherListOpen(false);
                              }}
                          >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTeacherForStatus === teacher.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {teacher.firstName} {teacher.lastName}
                          </Button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No se encontraron docentes.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
            {selectedTeacherForStatus && (
              <div className="grid gap-2">
                <Label htmlFor="status-select">Estado</Label>
                <Select onValueChange={(value) => setNewStatus(value as 'Activo' | 'Inactivo')} value={newStatus}>
                  <SelectTrigger id="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleStatusModalChange(false)}>Cancelar</Button>
            <Button onClick={handleStatusUpdate} disabled={!selectedTeacherForStatus}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
