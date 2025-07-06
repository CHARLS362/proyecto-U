'use client';

import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { LibraryBig, UploadCloud, Search, Download, Trash2, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Mock data
const mockSyllabi = {
  "primaria-1-A": [
    { id: 1, subject: "Matemática", fileName: "mat_prim_1A.pdf", uploadDate: "2024-03-10" },
    { id: 2, subject: "Comunicación", fileName: "com_prim_1A.pdf", uploadDate: "2024-03-11" },
  ],
  "secundaria-3-B": [
    { id: 3, subject: "Ciencia y Tecnología", fileName: "cyt_sec_3B.pdf", uploadDate: "2024-03-12" },
    { id: 4, subject: "Ciencias Sociales", fileName: "cs_sec_3B.pdf", uploadDate: "2024-03-12" },
  ]
};

const subjects = [
  { id: 1, name: "Matemática" },
  { id: 2, name: "Comunicación" },
  { id: 3, name: "Ciencia y Tecnología" },
  { id: 4, name: "Ciencias Sociales" },
  { id: 5, name: "Inglés" },
];

const primaryGrades = [
  { value: '1', label: '1º de Primaria' },
  { value: '2', label: '2º de Primaria' },
  { value: '3', label: '3º de Primaria' },
  { value: '4', label: '4º de Primaria' },
  { value: '5', label: '5º de Primaria' },
  { value: '6', label: '6º de Primaria' },
];

const secondaryGrades = [
  { value: '1', label: '1º de Secundaria' },
  { value: '2', label: '2º de Secundaria' },
  { value: '3', label: '3º de Secundaria' },
  { value: '4', label: '4º de Secundaria' },
  { value: '5', label: '5º de Secundaria' },
];


export default function CurriculumPage() {
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  const [foundSyllabi, setFoundSyllabi] = useState<typeof mockSyllabi[keyof typeof mockSyllabi] | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  const handleSearchSyllabus = () => {
    if (!selectedLevel || !selectedGrade || !selectedSection) {
        toast({
            title: "Filtros incompletos",
            description: "Por favor, seleccione nivel, grado y sección.",
            variant: "destructive"
        });
        return;
    }
    const key = `${selectedLevel}-${selectedGrade}-${selectedSection}` as keyof typeof mockSyllabi;
    const results = mockSyllabi[key] || [];
    setFoundSyllabi(results);
    toast({
        title: "Búsqueda completada",
        description: `Se encontraron ${results.length} programas de estudio.`
    });
  }

  const UploadDialogContent = () => (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Subir Programa de Estudios</DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="grid gap-2">
                <Label htmlFor="dialog-level">Nivel</Label>
                <Select>
                    <SelectTrigger id="dialog-level"><SelectValue placeholder="-- Nivel --" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="primaria">Primaria</SelectItem>
                        <SelectItem value="secundaria">Secundaria</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="dialog-grade">Grado</Label>
                <Select>
                    <SelectTrigger id="dialog-grade"><SelectValue placeholder="-- Grado --" /></SelectTrigger>
                    <SelectContent>
                      {primaryGrades.map(g => <SelectItem key={`p-${g.value}`} value={`p-${g.value}`}>{g.label}</SelectItem>)}
                      {secondaryGrades.map(g => <SelectItem key={`s-${g.value}`} value={`s-${g.value}`}>{g.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="dialog-section">Sección</Label>
                <Select>
                    <SelectTrigger id="dialog-section"><SelectValue placeholder="-- Sección --" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="subject-select">Asignatura</Label>
          <Select>
            <SelectTrigger id="subject-select">
              <SelectValue placeholder="-- Seleccionar Asignatura --" />
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
            Subir archivo PDF (tamaño máximo 20MB)
          </Label>
          <div className="flex items-center gap-2">
            <Input id="syllabus-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
            <Button asChild variant="outline" className="shrink-0">
              <Label htmlFor="syllabus-file" className="cursor-pointer font-normal">Seleccionar archivo</Label>
            </Button>
            <span className="text-sm text-muted-foreground truncate">{fileName}</span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={() => toast({ title: "Simulación exitosa", description: "El programa de estudios ha sido subido."})}>
          <UploadCloud className="mr-2 h-4 w-4" />
          Subir Programa
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Programa de estudios" subtitle="Gestione los planes de estudio por nivel, grado y sección." icon={LibraryBig}>
         <Dialog onOpenChange={(open) => !open && setFileName('Ningún archivo seleccionado')}>
            <DialogTrigger asChild>
              <Button>
                <UploadCloud className="mr-2 h-4 w-4" />
                Subir Programa
              </Button>
            </DialogTrigger>
            <UploadDialogContent />
          </Dialog>
      </PageTitle>
      
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">Buscar Programas de Estudio</CardTitle>
          <CardDescription>Seleccione los filtros para encontrar los planes de estudio de una clase específica.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap items-end gap-4">
                 <div className="grid gap-2 flex-grow sm:flex-grow-0">
                    <Label htmlFor="level-filter">Nivel</Label>
                    <Select value={selectedLevel} onValueChange={(value) => {
                        setSelectedLevel(value);
                        setSelectedGrade('');
                    }}>
                        <SelectTrigger id="level-filter" className="w-full sm:w-[200px]">
                            <SelectValue placeholder="-- Nivel --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="primaria">Primaria</SelectItem>
                            <SelectItem value="secundaria">Secundaria</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="grid gap-2 flex-grow sm:flex-grow-0">
                    <Label htmlFor="grade-filter">Grado</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={!selectedLevel}>
                        <SelectTrigger id="grade-filter" className="w-full sm:w-[200px]">
                            <SelectValue placeholder={!selectedLevel ? "Seleccione un nivel" : "-- Grado --"} />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedLevel === 'primaria' && primaryGrades.map(g => <SelectItem key={`pf-${g.value}`} value={g.value}>{g.label}</SelectItem>)}
                            {selectedLevel === 'secundaria' && secondaryGrades.map(g => <SelectItem key={`sf-${g.value}`} value={g.value}>{g.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
                  <div className="grid gap-2 flex-grow sm:flex-grow-0">
                    <Label htmlFor="section-filter">Sección</Label>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger id="section-filter" className="w-full sm:w-[200px]">
                            <SelectValue placeholder="-- Sección --" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="A">A</SelectItem>
                           <SelectItem value="B">B</SelectItem>
                           <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSearchSyllabus} className="w-full sm:w-auto">
                    <Search className="mr-2 h-4 w-4" />
                    Encontrar
                  </Button>
            </div>
        </CardContent>
      </Card>

      {foundSyllabi && (
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
                Programas de estudio encontrados para: {selectedLevel && `${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`} {selectedGrade && `- ${selectedGrade}º Grado`} {selectedSection && `- Sección ${selectedSection}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {foundSyllabi.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Asignatura</TableHead>
                            <TableHead>Archivo</TableHead>
                            <TableHead>Fecha de Subida</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {foundSyllabi.map((syllabus, index) => (
                             <TableRow key={syllabus.id}>
                                <TableCell className="font-medium">{index + 1}.</TableCell>
                                <TableCell>{syllabus.subject}</TableCell>
                                <TableCell className="text-muted-foreground">{syllabus.fileName}</TableCell>
                                <TableCell className="text-muted-foreground">{syllabus.uploadDate}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Descargar
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                 <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-accent/20 rounded-full mb-4">
                        <Database className="h-12 w-12 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Sin resultados</h3>
                    <p className="text-sm text-muted-foreground">No se encontraron programas para los filtros seleccionados.</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
