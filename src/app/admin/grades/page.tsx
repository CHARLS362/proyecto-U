
'use client';

import { useState } from 'react';
import { 
  NotebookText, 
  UploadCloud, 
  Search, 
  Eye, 
  Download, 
  Edit, 
  Trash2 
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

export default function GradesPage() {
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
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
  
  const subjects = [
    { id: 1, name: "Hindi" },
    { id: 2, name: "Inglés" },
    { id: 3, name: "Matemáticas" },
    { id: 4, name: "Ciencias" },
    { id: 5, name: "Comercio" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-3">
          <NotebookText className="h-7 w-7 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Notas</h1>
        </div>
        <Dialog onOpenChange={(open) => !open && setFileName('Ningún archivo seleccionado')}>
          <DialogTrigger asChild>
            <Button className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900">
              <UploadCloud className="mr-2 h-4 w-4" />
              Cargar Notas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Subir notas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="class-upload">Clase</Label>
                  <Select defaultValue="12-comercio">
                    <SelectTrigger id="class-upload"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                      <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                      <SelectItem value="10-arte">10 (Arte)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject-upload">Sujeto</Label>
                  <Select>
                    <SelectTrigger id="subject-upload"><SelectValue placeholder="--select--" /></SelectTrigger>
                    <SelectContent>
                       {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name.toLowerCase()}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title-upload">Título</Label>
                <Input id="title-upload" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comment-upload">Comentario</Label>
                <Textarea id="comment-upload" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file-upload" className="text-sm text-muted-foreground">
                  Subir archivo (tamaño máximo 200 MB)
                </Label>
                <div className="flex items-center gap-2">
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                    <Button asChild variant="outline" className="shrink-0">
                      <Label htmlFor="file-upload" className="cursor-pointer font-normal">Seleccionar archivo</Label>
                    </Button>
                    <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                <UploadCloud className="mr-2 h-4 w-4" />
                Subir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Separator />

      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-end gap-4">
          <div className="grid gap-2">
            <Label htmlFor="class">Clase</Label>
            <Select defaultValue="12-comercio">
              <SelectTrigger id="class" className="w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                <SelectItem value="10-arte">10 (Arte)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
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
                  <span>{assignment.file.size} ({assignment.file.name.split('.').pop()})</span>
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
