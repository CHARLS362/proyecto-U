
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { CalendarClock, Search, Edit, Save, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type SchedulePeriod = {
  start: string;
  end: string;
  subject: string;
};

type ScheduleBreak = {
  type: 'break';
  name: string;
};

type ScheduleItem = SchedulePeriod | ScheduleBreak;


const initialScheduleData: { [key: string]: ScheduleItem[] } = {
  lunes: [
    { start: '07:00', end: '08:00', subject: 'Hindi' },
    { start: '08:00', end: '09:00', subject: 'Inglés' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { start: '10:00', end: '11:00', subject: 'Hindi' },
    { start: '11:00', end: '12:00', subject: 'Inglés' },
    { type: 'break', name: 'ALMUERZO' },
    { start: '12:00', end: '13:00', subject: 'Comercio' },
    { start: '13:00', end: '14:00', subject: 'Comercio' },
    { start: '14:00', end: '15:00', subject: 'Hindi' },
  ],
  martes: [
    { start: '07:00', end: '08:00', subject: 'Ciencias' },
    { start: '08:00', end: '09:00', subject: 'Educación Física' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { start: '10:00', end: '11:00', subject: 'Historia' },
    { start: '11:00', end: '12:00', subject: 'Geografía' },
    { type: 'break', name: 'ALMUERZO' },
    { start: '12:00', end: '13:00', subject: 'Inglés' },
    { start: '13:00', end: '14:00', subject: 'Inglés' },
    { start: '14:00', end: '15:00', subject: 'Arte' },
  ],
  miercoles: [
    { start: '07:00', end: '08:00', subject: 'Hindi' },
    { start: '08:00', end: '09:00', subject: 'Inglés' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { start: '10:00', end: '11:00', subject: 'Hindi' },
    { start: '11:00', end: '12:00', subject: 'Inglés' },
    { type: 'break', name: 'ALMUERZO' },
    { start: '12:00', end: '13:00', subject: 'Comercio' },
    { start: '13:00', end: '14:00', subject: 'Comercio' },
    { start: '14:00', end: '15:00', subject: 'Hindi' },
  ],
  jueves: [
    { start: '07:00', end: '08:00', subject: 'Ciencias' },
    { start: '08:00', end: '09:00', subject: 'Educación Física' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { start: '10:00', end: '11:00', subject: 'Historia' },
    { start: '11:00', end: '12:00', subject: 'Geografía' },
    { type: 'break', name: 'ALMUERZO' },
    { start: '12:00', end: '13:00', subject: 'Inglés' },
    { start: '13:00', end: '14:00', subject: 'Inglés' },
    { start: '14:00', end: '15:00', subject: 'Arte' },
  ],
  viernes: [
    { start: '07:00', end: '08:00', subject: 'Hindi' },
    { start: '08:00', end: '09:00', subject: 'Inglés' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { start: '10:00', end: '11:00', subject: 'Hindi' },
    { start: '11:00', end: '12:00', subject: 'Inglés' },
    { type: 'break', name: 'ALMUERZO' },
    { start: '12:00', end: '13:00', subject: 'Comercio' },
    { start: '13:00', end: '14:00', subject: 'Comercio' },
    { start: '14:00', end: '15:00', subject: 'Música' },
  ],
};

const daysOfWeek = [
  { key: 'lunes', label: 'LUNES' },
  { key: 'martes', label: 'MARTES' },
  { key: 'miercoles', label: 'MIÉRCOLES' },
  { key: 'jueves', label: 'JUEVES' },
  { key: 'viernes', label: 'VIERNES' },
];

export default function SchedulePage() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [schedules, setSchedules] = useState(initialScheduleData);
  const [tempSchedules, setTempSchedules] = useState(initialScheduleData);

  const handleFind = () => {
    setShowSchedule(true);
  };
  
  const handleEdit = () => {
    setTempSchedules(schedules);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setSchedules(tempSchedules);
    setIsEditing(false);
    console.log("Horario guardado:", tempSchedules);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleScheduleChange = (dayKey: string, itemIndex: number, field: keyof SchedulePeriod, value: string) => {
    setTempSchedules(prev => {
        const newSchedules = { ...prev };
        const daySchedule = [...newSchedules[dayKey]];
        const updatedItem = { ...daySchedule[itemIndex], [field]: value };
        daySchedule[itemIndex] = updatedItem as SchedulePeriod;
        newSchedules[dayKey] = daySchedule;
        return newSchedules;
    });
  };

  const handleDayChange = (offset: number) => {
    if (isEditing) return;
    setSelectedDayIndex((prevIndex) => {
      const newIndex = prevIndex + offset;
      if (newIndex < 0) return daysOfWeek.length - 1;
      if (newIndex >= daysOfWeek.length) return 0;
      return newIndex;
    });
  };

  const currentDayKey = daysOfWeek[selectedDayIndex].key;
  const currentSchedule = (isEditing ? tempSchedules[currentDayKey] : schedules[currentDayKey]) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
            <CalendarClock className="h-7 w-7 text-muted-foreground" />
            <h1 className="text-2xl font-semibold text-foreground">Horario</h1>
        </div>
        <Separator className="mt-4" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Horario
            </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-1.5 flex-grow sm:flex-grow-0">
              <Label htmlFor="class">Clase</Label>
              <Select defaultValue="12-comercio" disabled={isEditing}>
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
            <div className="grid gap-1.5 flex-grow sm:flex-grow-0">
              <Label htmlFor="section">Sección</Label>
              <Select defaultValue="A" disabled={isEditing}>
                <SelectTrigger id="section" className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full sm:w-auto" onClick={handleFind} disabled={isEditing}>
              <Search className="mr-2 h-4 w-4" />
              Encontrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSchedule && (
        <Card className="shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <Badge className="w-fit text-base font-semibold px-4 py-1.5 bg-muted text-muted-foreground hover:bg-muted">Clase 12c A</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between border rounded-md p-1 bg-muted/50 mb-6">
              <Button variant="ghost" className="text-muted-foreground" onClick={() => handleDayChange(-1)} disabled={isEditing}>
                anterior
              </Button>
              <div className="flex-grow text-center">
                 <Button variant="default" className="w-32 shadow-md" disabled={isEditing}>
                    {daysOfWeek[selectedDayIndex].label}
                 </Button>
              </div>
              <Button variant="ghost" className="text-muted-foreground" onClick={() => handleDayChange(1)} disabled={isEditing}>
                próximo
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-b-amber-500 hover:bg-transparent">
                  <TableHead className="text-amber-600 dark:text-amber-400 font-semibold">Inicio del periodo</TableHead>
                  <TableHead className="text-amber-600 dark:text-amber-400 font-semibold">Fin del período</TableHead>
                  <TableHead className="text-amber-600 dark:text-amber-400 font-semibold">Sujeto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSchedule.map((item, index) =>
                  item.type === 'break' ? (
                    <TableRow key={index} className="hover:bg-transparent">
                      <TableCell colSpan={3} className="text-center font-semibold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 py-3">
                        {item.name}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index}>
                      <TableCell>
                        {isEditing ? (
                           <Input 
                            value={(item as SchedulePeriod).start} 
                            onChange={(e) => handleScheduleChange(currentDayKey, index, 'start', e.target.value)}
                            className="bg-background/50"
                           />
                        ) : (
                          (item as SchedulePeriod).start
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                           <Input 
                            value={(item as SchedulePeriod).end} 
                            onChange={(e) => handleScheduleChange(currentDayKey, index, 'end', e.target.value)}
                            className="bg-background/50"
                           />
                        ) : (
                          (item as SchedulePeriod).end
                        )}
                      </TableCell>
                       <TableCell>
                        {isEditing ? (
                           <Input 
                            value={(item as SchedulePeriod).subject} 
                            onChange={(e) => handleScheduleChange(currentDayKey, index, 'subject', e.target.value)}
                            className="bg-background/50"
                           />
                        ) : (
                          (item as SchedulePeriod).subject
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-6 mt-4 border-t">
            {isEditing ? (
                <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700 font-semibold shadow-md">
                        <Save className="mr-2 h-4 w-4" /> Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                        <XCircle className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                </div>
            ) : (
                <Button onClick={handleEdit} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
            )}
            <div className="text-right">
                <p className="text-xs text-muted-foreground">Última edición por usted</p>
                <p className="text-xs text-muted-foreground">10 de junio de 2024</p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
