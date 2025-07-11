
'use client';

import { useState, useMemo } from 'react';
import { PageTitle } from '@/components/common/PageTitle';
import { 
  MessageSquare, 
  User, 
  Send 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { mockStudents, type Student } from '@/lib/mockData';

// Data for filters
const primaryGrades = [
  { value: '1-pri', label: '1º de Primaria' },
  { value: '2-pri', label: '2º de Primaria' },
  { value: '3-pri', label: '3º de Primaria' },
  { value: '4-pri', label: '4º de Primaria' },
  { value: '5-pri', label: '5º de Primaria' },
  { value: '6-pri', label: '6º de Primaria' },
];

const secondaryGrades = [
  { value: '1-sec', label: '1º de Secundaria' },
  { value: '2-sec', label: '2º de Secundaria' },
  { value: '3-sec', label: '3º de Secundaria' },
  { value: '4-sec', label: '4º de Secundaria' },
  { value: '5-sec', label: '5º de Secundaria' },
];

export default function StudentFeedbackPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  
  // Filter states
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  
  // Message state
  const [message, setMessage] = useState('');

  const filteredStudentsForSelection = useMemo(() => {
    if (!selectedGrade || !selectedSection) {
      return [];
    }
    return students.filter(student => 
      student.classId === selectedGrade && 
      student.section === selectedSection
    );
  }, [students, selectedGrade, selectedSection]);

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const handleSendMessage = () => {
    if (!selectedStudentId) {
      toast({ title: "Sin destinatario", description: "Por favor, seleccione un estudiante.", variant: "destructive" });
      return;
    }
    if (!message.trim()) {
        toast({ title: "Mensaje vacío", description: "No puede enviar un mensaje vacío.", variant: "destructive" });
        return;
    }

    console.log(`Sending message to ${selectedStudent?.name}: ${message}`);
    toast({ title: "Mensaje Enviado", description: `Tu mensaje para ${selectedStudent?.name} ha sido enviado.`, variant: "success"});
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Retroalimentación" subtitle="Envíe comentarios privados a los estudiantes." icon={MessageSquare} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Seleccionar Estudiante</CardTitle>
          <CardDescription>Use los filtros para encontrar un estudiante y enviarle retroalimentación.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="level">Nivel</Label>
              <Select value={selectedLevel} onValueChange={(value) => {
                  setSelectedLevel(value);
                  setSelectedGrade('');
                  setSelectedStudentId('');
              }}>
                <SelectTrigger id="level"><SelectValue placeholder="Seleccionar Nivel" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primaria">Primaria</SelectItem>
                  <SelectItem value="Secundaria">Secundaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Grado</Label>
              <Select value={selectedGrade} onValueChange={(value) => {
                  setSelectedGrade(value);
                  setSelectedStudentId('');
              }} disabled={!selectedLevel}>
                <SelectTrigger id="grade"><SelectValue placeholder={!selectedLevel ? "Seleccione nivel" : "Seleccionar Grado"} /></SelectTrigger>
                <SelectContent>
                  {selectedLevel === 'Primaria' && primaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                  {selectedLevel === 'Secundaria' && secondaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="section">Sección</Label>
              <Select value={selectedSection} onValueChange={(value) => {
                  setSelectedSection(value);
                  setSelectedStudentId('');
              }}>
                <SelectTrigger id="section"><SelectValue placeholder="Seleccionar Sección" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student">Estudiante</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={!selectedGrade || !selectedSection}>
                <SelectTrigger id="student"><SelectValue placeholder={!selectedGrade || !selectedSection ? "Faltan filtros" : "Seleccionar Estudiante"} /></SelectTrigger>
                <SelectContent>
                  {filteredStudentsForSelection.length > 0 ? (
                    filteredStudentsForSelection.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No hay estudiantes</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Perfil del Estudiante</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            {selectedStudent ? (
              <>
                <Avatar className="h-24 w-24 mb-4 border-2 border-border">
                  <AvatarImage src={selectedStudent.avatarUrl} alt={selectedStudent.name} data-ai-hint="student avatar" />
                  <AvatarFallback>{selectedStudent.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground">{selectedStudent.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStudent.id}</p>
                <div className="text-left text-sm text-muted-foreground mt-4 space-y-2 w-full bg-muted/30 p-4 rounded-lg">
                  <p><span className="font-medium text-foreground/80">Grado:</span> {selectedStudent.gradeLevel}</p>
                  <p><span className="font-medium text-foreground/80">Teléfono:</span> {selectedStudent.phone}</p>
                  <p><span className="font-medium text-foreground/80">Apoderado:</span> {selectedStudent.guardianName}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 h-full text-muted-foreground">
                <User className="h-16 w-16 mb-4 opacity-50" />
                <p className="font-medium">Seleccione un estudiante</p>
                <p className="text-sm text-center">Use los filtros de arriba para encontrar y seleccionar un estudiante.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>Canal de Comunicación</CardTitle>
            <CardDescription>Los mensajes enviados aquí son privados entre usted y el estudiante.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center bg-muted/50 rounded-md m-6 mt-0">
            <p className="text-muted-foreground">El historial de mensajes se mostrará aquí.</p>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="relative w-full">
              <Textarea 
                placeholder={selectedStudent ? `Escribe un mensaje para ${selectedStudent.firstName}...` : 'Seleccione un estudiante para enviar un mensaje'} 
                className="pr-12 bg-card resize-none" 
                rows={2} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!selectedStudentId}
              />
              <Button 
                size="icon" 
                className="absolute right-2.5 bottom-2.5 h-8 w-8"
                onClick={handleSendMessage}
                disabled={!selectedStudentId || !message.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar mensaje</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
