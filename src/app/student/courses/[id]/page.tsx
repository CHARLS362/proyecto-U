'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  BookOpenText,
  NotebookText,
  Megaphone,
  UserCircle,
  Clock,
  CalendarDays,
  UploadCloud,
  FileText as FileIcon,
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import {
  mockCourses,
  mockAssignments,
  mockCourseAnnouncements,
} from '@/lib/mockData';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');
  const [isUploading, setIsUploading] = useState(false);

  const course = mockCourses.find((c) => c.id === params.id);
  const assignments = mockAssignments.filter((a) => a.courseId === params.id);
  const announcements = mockCourseAnnouncements.filter((a) => a.courseId === params.id);

  if (!course) {
    notFound();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  const handleFileUpload = (assignmentTitle: string) => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
        setIsUploading(false);
        setFileName('Ningún archivo seleccionado');
        toast({
            title: "Tarea Subida",
            description: `Tu archivo para "${assignmentTitle}" ha sido entregado.`,
            variant: "success",
        });
        // Here you would typically close the dialog.
        // For simulation, we just log. In a real app, manage dialog open state.
    }, 1500);
  };
  
  const getStatusBadge = (status: 'Pendiente' | 'Entregado' | 'Calificado') => {
    switch(status) {
        case 'Pendiente':
            return <Badge variant="destructive">Pendiente</Badge>;
        case 'Entregado':
            return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Entregado</Badge>;
        case 'Calificado':
            return <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">Calificado</Badge>;
        default:
            return <Badge variant="outline">Desconocido</Badge>;
    }
  };


  return (
    <div className="space-y-6">
      <PageTitle title={course.name} subtitle={course.code} icon={BookOpenText}>
        <Button variant="outline" asChild>
          <Link href="/student/courses">Volver a Cursos</Link>
        </Button>
      </PageTitle>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="tareas">Tareas y Calificaciones</TabsTrigger>
          <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Detalles del Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">{course.description}</p>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                      <UserCircle className="h-5 w-5 text-primary"/>
                      <span className="font-medium text-foreground">Instructor:</span>
                      <span>{course.instructor}</span>
                  </div>
                   <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary"/>
                      <span className="font-medium text-foreground">Horario:</span>
                      <span>{course.schedule}</span>
                  </div>
                   <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-primary"/>
                      <span className="font-medium text-foreground">Créditos:</span>
                      <span>{course.credits}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <BookOpenText className="h-5 w-5 text-primary"/>
                      <span className="font-medium text-foreground">Departamento:</span>
                      <span>{course.department}</span>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tareas" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Tareas y Calificaciones</CardTitle>
              <CardDescription>Aquí encontrarás tus tareas, fechas de entrega y calificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.length > 0 ? (
                assignments.map(assignment => (
                    <Card key={assignment.id} className="bg-muted/30">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                    <CardDescription>
                                        Fecha de entrega: {assignment.dueDate}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(assignment.status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{assignment.description}</p>
                             {assignment.status === 'Calificado' && (
                                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                                    <h4 className="font-semibold text-green-700 dark:text-green-300">Calificación: {assignment.grade}/20</h4>
                                    {assignment.feedback && <p className="text-xs text-green-600 dark:text-green-400 mt-1">Feedback: {assignment.feedback}</p>}
                                </div>
                            )}
                            {assignment.status === 'Entregado' && assignment.submittedFile && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-foreground p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    <span>Entregado: {assignment.submittedFile}</span>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            {assignment.status === 'Pendiente' && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <UploadCloud className="mr-2 h-4 w-4"/>
                                            Subir Tarea
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent onInteractOutside={(e) => { if(isUploading) e.preventDefault(); }}>
                                        <DialogHeader>
                                            <DialogTitle>Subir: {assignment.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <p className="text-sm text-muted-foreground">Sube tu archivo para completar la tarea. Formatos aceptados: PDF, DOCX, PNG, JPG.</p>
                                            <div className="grid gap-2">
                                                <Label htmlFor="task-file">Archivo de la tarea</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input id="task-file" type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                                                    <Button asChild variant="outline" disabled={isUploading}>
                                                        <Label htmlFor="task-file" className="cursor-pointer font-normal">Seleccionar archivo</Label>
                                                    </Button>
                                                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" onClick={() => handleFileUpload(assignment.title)} disabled={isUploading || fileName === 'Ningún archivo seleccionado'}>
                                                {isUploading ? "Subiendo..." : "Entregar Tarea"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardFooter>
                    </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay tareas para este curso.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anuncios" className="mt-6">
          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Anuncios del Curso</CardTitle>
                <CardDescription>Anuncios importantes de tu instructor.</CardDescription>
             </CardHeader>
            <CardContent className="space-y-4">
                {announcements.length > 0 ? (
                    announcements.map(announcement => (
                        <div key={announcement.id} className="p-4 border-l-4 border-primary bg-muted/30 rounded-r-lg">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                                <span className="text-xs text-muted-foreground">{announcement.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{announcement.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-8">No hay anuncios para este curso.</p>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
