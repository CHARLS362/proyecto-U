
'use client';

import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { BookCopy, PlusCircle, Search as SearchIcon, ListOrdered, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

// Mock data for subjects
const initialSubjects = [
  { id: 1, name: "No" },
  { id: 2, name: "Comercio" },
  { id: 3, name: "Inglés" },
  { id: 4, name: "Matemáticas" },
  { id: 5, name: "Ciencias" },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [selectedClass, setSelectedClass] = useState("12 (Comercio)");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectClass, setNewSubjectClass] = useState("12-comercio");

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
      const newSubject = { id: newId, name: newSubjectName };
      setSubjects(prevSubjects => [...prevSubjects, newSubject]);
      setNewSubjectName("");
      setIsAddModalOpen(false);
      console.log("Nuevo asunto agregado (simulación):", { name: newSubjectName, class: newSubjectClass });
    }
  };

  const classMap: { [key: string]: string } = {
    '12-comercio': '12 (Comercio)',
    '11-ciencia': '11 (Ciencia)',
    '10-arte': '10 (Arte)',
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Temas" icon={BookCopy}>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar asunto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubject}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="class-select">Clase</Label>
                  <Select value={newSubjectClass} onValueChange={setNewSubjectClass}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="Seleccionar Clase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                      <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                      <SelectItem value="10-arte">10 (Arte)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Nombre del sujeto</Label>
                  <Input
                    id="subject-name"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageTitle>

      <Card className="shadow-lg animate-fade-in">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="grid gap-2 w-full sm:w-auto">
              <Label htmlFor="class">Clase</Label>
              <Select 
                defaultValue="12-comercio"
                onValueChange={(value) => setSelectedClass(classMap[value] || '')}
              >
                <SelectTrigger id="class" className="w-full sm:w-[200px]">
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
              <SearchIcon className="mr-2 h-4 w-4" />
              Encontrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Asignaturas de clase {selectedClass}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Sujeto</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow key={subject.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{index + 1}.</TableCell>
                  <TableCell>{subject.name}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}
