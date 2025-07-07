
'use client';

import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { LibraryBig, FileText, UploadCloud, Search, Download, Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const subjects = [
  { id: 1, name: "No" },
  { id: 2, name: "Inglés" },
  { id: 3, name: "Matemáticas" },
  { id: 4, name: "Ciencias" },
  { id: 5, name: "Comercio" },
];

// Create a self-contained component for the dialog
const UploadSyllabusDialog = ({ trigger, subjectName }: { trigger: React.ReactNode, subjectName?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Programa de Estudios Subido",
        description: "El archivo ha sido subido y asociado al curso exitosamente.",
        variant: "success",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error al Subir",
        description: "No se pudo subir el archivo. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setFileName('Ningún archivo seleccionado');
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => { if (isSubmitting) e.preventDefault(); }}>
        <DialogHeader>
          <DialogTitle>{subjectName ? `Subir programa para ${subjectName}`: 'Subir programa de estudios'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="py-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="class-select">Clase</Label>
                <Select defaultValue="12-comercio" disabled={isSubmitting}>
                  <SelectTrigger id="class-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                    <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                    <SelectItem value="10-arte">10 (Arte)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject-select">Sujeto</Label>
                <Select defaultValue={subjectName?.toLowerCase()} disabled={isSubmitting}>
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder="--select--" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name.toLowerCase()}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="syllabus-file" className="text-sm text-muted-foreground">
                  Subir archivo pdf (tamaño máximo 200 MB)
                </Label>
                <div className="flex items-center gap-2">
                  <Input id="syllabus-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" disabled={isSubmitting} />
                  <Button asChild variant="outline" className="shrink-0" disabled={isSubmitting}>
                    <Label htmlFor="syllabus-file" className="cursor-pointer font-normal">Seleccionar archivo</Label>
                  </Button>
                  <span className="text-sm text-muted-foreground truncate">{fileName}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting || fileName === 'Ningún archivo seleccionado'}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                {isSubmitting ? "Subiendo..." : "Subir"}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function TeacherCurriculumPage() {

  return (
    <div className="space-y-6">
      <PageTitle title="Programa de estudios" icon={LibraryBig} />
      
      <Card className="shadow-lg animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Programa de estudios</CardTitle>
          </div>
          <UploadSyllabusDialog 
            trigger={
              <Button className="bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900">
                <UploadCloud className="mr-2 h-4 w-4" />
                Subir programa de estudios
              </Button>
            }
          />
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
            <div className="flex items-end gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="class">Clase</Label>
                    <Select defaultValue="12-comercio">
                      <SelectTrigger id="class" className="w-[200px]">
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
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Sujeto</TableHead>
                        <TableHead className="text-center">Programa de estudios</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjects.slice(0, 2).map((subject, index) => (
                         <TableRow key={subject.id}>
                            <TableCell className="font-medium">{index + 1}.</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell className="text-center space-x-2">
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar
                                </Button>
                                <UploadSyllabusDialog 
                                  subjectName={subject.name}
                                  trigger={
                                    <Button className="bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Subir
                                    </Button>
                                  }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </CardContent>
      </Card>
    </div>
  );
}
