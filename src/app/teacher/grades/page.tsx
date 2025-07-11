
'use client';

import { useState, useMemo } from 'react';
import { 
  NotebookText, 
  UploadCloud, 
  Search, 
  Eye, 
  Download, 
  Edit, 
  Trash2,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockCourses } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

// Simula el ID del docente que ha iniciado sesión
const LOGGED_IN_TEACHER_ID = "T1749005331";

const UploadGradesDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const teacherCourses = useMemo(() => {
    return mockCourses.filter(course => course.instructorId === LOGGED_IN_TEACHER_ID);
  }, []);

  const availableClasses = useMemo(() => {
    const classSet = new Set(teacherCourses.map(c => c.classId || ''));
    return Array.from(classSet).filter(Boolean);
  }, [teacherCourses]);

  const classDisplayMapping: { [key: string]: string } = {
      "5-sec": "5º de Secundaria",
      "3-sec": "3º de Secundaria",
      "4-sec": "4º de Secundaria",
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Notas Subidas",
        description: "El archivo de notas ha sido subido y procesado.",
        variant: "success",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error al Subir",
        description: "No se pudo subir el archivo de notas.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setFileName('Ningún archivo seleccionado');
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => { if (isSubmitting) e.preventDefault(); }}>
        <DialogHeader>
          <DialogTitle>Subir notas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="class-upload">Grado</Label>
                <Select disabled={isSubmitting}>
                    <SelectTrigger id="class-upload"><SelectValue placeholder="Seleccionar Grado" /></SelectTrigger>
                    <SelectContent>
                        {availableClasses.map(classId => (
                            <SelectItem key={classId} value={classId}>{classDisplayMapping[classId] || classId}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="section-upload">Sección</Label>
                <Select disabled={isSubmitting}>
                    <SelectTrigger id="section-upload"><SelectValue placeholder="Sección"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="subject-upload">Curso</Label>
                <Select disabled={isSubmitting}>
                    <SelectTrigger id="subject-upload"><SelectValue placeholder="Seleccionar Curso" /></SelectTrigger>
                    <SelectContent>
                       {teacherCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
                </div>
            <div className="grid gap-2">
                <Label htmlFor="title-upload">Título</Label>
                <Input id="title-upload" disabled={isSubmitting}/>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="comment-upload">Comentario</Label>
                <Textarea id="comment-upload" disabled={isSubmitting}/>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="file-upload" className="text-sm text-muted-foreground">
                Subir archivo (tamaño máximo 200 MB)
                </Label>
                <div className="flex items-center gap-2">
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} disabled={isSubmitting}/>
                    <Button asChild variant="outline" className="shrink-0" disabled={isSubmitting}>
                    <Label htmlFor="file-upload" className="cursor-pointer font-normal">Seleccionar archivo</Label>
                    </Button>
                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting || fileName === 'Ningún archivo seleccionado'}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Subiendo...' : 'Subir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function TeacherGradesPage() {
  const { toast } = useToast();

  const teacherCourses = useMemo(() => {
    return mockCourses.filter(course => course.instructorId === LOGGED_IN_TEACHER_ID);
  }, []);

  const availableClasses = useMemo(() => {
    const classSet = new Set(teacherCourses.map(c => c.classId || ''));
    return Array.from(classSet).filter(Boolean);
  }, [teacherCourses]);

  const classDisplayMapping: { [key: string]: string } = {
      "5-sec": "5º de Secundaria",
      "3-sec": "3º de Secundaria",
      "4-sec": "4º de Secundaria",
  };

  const assignments = [
    {
      id: 1,
      title: 'Tarea de hindi',
      date: '19 de junio de 2024',
      status: 'Hazlo a tiempo',
      statusColor: 'text-green-600 dark:text-green-400',
      file: { name: 'tarea.png', size: '7 KB' }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-3">
          <NotebookText className="h-7 w-7 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Notas</h1>
        </div>
        <UploadGradesDialog 
          trigger={
            <Button className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900">
              <UploadCloud className="mr-2 h-4 w-4" />
              Cargar Notas
            </Button>
          }
        />
      </div>
      
      <Separator />

      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="grid gap-2">
            <Label htmlFor="class">Grado</Label>
            <Select>
              <SelectTrigger id="class">
                <SelectValue placeholder="Seleccionar Grado" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map(classId => (
                    <SelectItem key={classId} value={classId}>{classDisplayMapping[classId] || classId}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="section">Sección</Label>
            <Select>
                <SelectTrigger id="section"><SelectValue placeholder="Sección"/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Curso</Label>
            <Select>
                <SelectTrigger id="subject"><SelectValue placeholder="Seleccionar Curso"/></SelectTrigger>
                <SelectContent>
                    {teacherCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toast({title: "Búsqueda realizada"})}>
            <Search className="mr-2 h-4 w-4" />
            Encontrar
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="bg-muted/30 shadow-sm w-full max-w-md overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <CardDescription>{assignment.date}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2">
                <span className={`text-sm font-semibold ${assignment.statusColor}`}>
                  {assignment.status}
                </span>
              </CardContent>
              <CardFooter className="p-2 flex justify-between items-center border-t bg-card">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4"/></Button>
                  <span>{`${assignment.file.size} (${assignment.file.name.split('.').pop()})`}</span>
                </div>
                <div className="flex items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700">
                        <Edit className="h-4 w-4"/>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                          <DialogTitle>Editar notas cargadas</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                  <Label htmlFor="class-edit">Clase</Label>
                                  <Select defaultValue="12-comercio">
                                      <SelectTrigger id="class-edit"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                                          <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                                          <SelectItem value="10-arte">10 (Arte)</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div className="grid gap-2">
                                  <Label htmlFor="subject-edit">Sujeto</Label>
                                  <Select defaultValue="hindi">
                                      <SelectTrigger id="subject-edit"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="hindi">Hindi</SelectItem>
                                          <SelectItem value="ingles">Inglés</SelectItem>
                                          <SelectItem value="matematicas">Matemáticas</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                          </div>
                          <div className="grid gap-2">
                              <Label htmlFor="title-edit">título</Label>
                              <Input id="title-edit" defaultValue="Hindi Homework" />
                          </div>
                          <div className="grid gap-2">
                              <Label htmlFor="comment-edit">Comentario</Label>
                              <Textarea id="comment-edit" defaultValue="do this on time" />
                          </div>
                          <div className="grid gap-2">
                              <Label>archivo</Label>
                              <div className="space-y-2">
                                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                      <UploadCloud className="h-5 w-5" />
                                  </Button>
                                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                                      <Eye className="h-5 w-5" />
                                  </Button>
                              </div>
                          </div>
                      </div>
                      <DialogFooter className="flex-row justify-between items-center pt-4 border-t">
                          <p className="text-xs text-muted-foreground">Última edición por Admin Kumar</p>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                              <UploadCloud className="mr-2 h-4 w-4" />
                              Editar
                          </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Separator />
        
        <div className="flex justify-end items-center gap-2 pt-4">
            <Button variant="outline" size="sm">anterior</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">próximo</Button>
        </div>
      </div>
    </div>
  );
}
