
'use client';

import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { BookCopy, PlusCircle, Search as SearchIcon, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for subjects, now with level
const initialSubjects = [
  { id: 1, name: "Matemática", level: "Ambos" },
  { id: 2, name: "Comunicación", level: "Ambos" },
  { id: 3, name: "Ciencia y Tecnología", level: "Secundaria" },
  { id: 4, name: "Personal Social", level: "Primaria" },
  { id: 5, name: "Educación Física", level: "Ambos" },
  { id: 6, name: "Arte y Cultura", level: "Ambos" },
  { id: 7, name: "Inglés", level: "Ambos" },
  { id: 8, name: "Religión", level: "Ambos" },
  { id: 9, name: "Desarrollo Personal, Ciudadanía y Cívica", level: "Secundaria" },
  { id: 10, name: "Ciencias Sociales", level: "Secundaria" },
  { id: 11, name: "Educación para el Trabajo", level: "Secundaria" },
  { id: 12, name: "Filosofía", level: "Secundaria" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentSubjectId, setCurrentSubjectId] = useState<number | null>(null);

  const [subjectName, setSubjectName] = useState("");
  const [subjectLevel, setSubjectLevel] = useState("");

  const { toast } = useToast();

  const handleOpenModal = (mode: 'add' | 'edit', subject: typeof initialSubjects[0] | null = null) => {
    setModalMode(mode);
    if (mode === 'edit' && subject) {
      setCurrentSubjectId(subject.id);
      setSubjectName(subject.name);
      setSubjectLevel(subject.level);
    } else {
      setCurrentSubjectId(null);
      setSubjectName('');
      setSubjectLevel('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectLevel) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    if (modalMode === 'add') {
      const newSubject = {
        id: subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
        name: subjectName,
        level: subjectLevel,
      };
      setSubjects(prev => [...prev, newSubject]);
      toast({ title: "Asignatura Agregada", description: `La asignatura "${subjectName}" ha sido creada.`, variant: "success" });
    } else if (currentSubjectId) {
      setSubjects(prev => prev.map(s => 
        s.id === currentSubjectId ? { ...s, name: subjectName, level: subjectLevel } : s
      ));
      toast({ title: "Asignatura Actualizada", description: `La asignatura "${subjectName}" ha sido actualizada.`, variant: "success" });
    }

    handleCloseModal();
  };
  
  const levelBadgeColor = (level: string) => {
    switch(level) {
      case 'Primaria': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Secundaria': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Ambos': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      default: return 'bg-muted text-muted-foreground';
    }
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Asignaturas" subtitle="Administre la lista maestra de asignaturas de la institución." icon={BookCopy}>
          <Button onClick={() => handleOpenModal('add')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Asignatura
          </Button>
      </PageTitle>

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center">
             <CardTitle className="text-lg">Lista de Asignaturas</CardTitle>
             <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar asignatura..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Nombre de la Asignatura</TableHead>
                <TableHead>Nivel Educativo</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject, index) => (
                <TableRow key={subject.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{index + 1}.</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={levelBadgeColor(subject.level)}>
                      {subject.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenModal('edit', subject)}>
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                        setSubjects(prev => prev.filter(s => s.id !== subject.id));
                        toast({ title: "Asignatura Eliminada", description: `Se eliminó "${subject.name}".`, variant: "success"});
                    }}>
                      <Trash2 className="mr-1 h-3 w-3" /> Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredSubjects.length === 0 && (
            <p className="p-6 text-center text-muted-foreground">
              No se encontraron asignaturas.
            </p>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{modalMode === 'add' ? 'Agregar Asignatura' : 'Editar Asignatura'}</DialogTitle>
              <DialogDescription>
                Complete los detalles de la asignatura.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Nombre de la Asignatura</Label>
                  <Input
                    id="subject-name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Ej: Matemática"
                    required
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="subject-level">Nivel Educativo</Label>
                   <Select value={subjectLevel} onValueChange={setSubjectLevel} required>
                    <SelectTrigger id="subject-level">
                      <SelectValue placeholder="Seleccionar Nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primaria">Primaria</SelectItem>
                      <SelectItem value="Secundaria">Secundaria</SelectItem>
                      <SelectItem value="Ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit">
                  {modalMode === 'add' ? 'Agregar Asignatura' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </div>
  );
}
