
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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


// This now represents the fixed schedule for the logged-in teacher
const teacherScheduleData: { [key: string]: ScheduleItem[] } = {
  lunes: [
    { start: '08:00', end: '09:00', subject: 'Inglés' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { type: 'break', name: 'RECESO' },
    { start: '12:00', end: '13:00', subject: 'Comercio' },
    { start: '13:00', end: '14:00', subject: 'Comercio' },
  ],
  martes: [
    { start: '08:00', end: '09:00', subject: 'Educación Física' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { type: 'break', name: 'RECESO' },
    { start: '13:00', end: '14:00', subject: 'Inglés' },
  ],
  miercoles: [
    { start: '08:00', end: '09:00', subject: 'Inglés' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { type: 'break', name: 'RECESO' },
    { start: '12:00', end: '13:00', subject: 'Comercio' },
    { start: '13:00', end: '14:00', subject: 'Comercio' },
  ],
  jueves: [
    { start: '08:00', end: '09:00', subject: 'Educación Física' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { type: 'break', name: 'RECESO' },
    { start: '13:00', end: '14:00', subject: 'Inglés' },
  ],
  viernes: [
    { start: '08:00', end: '09:00', subject: 'Inglés' },
    { start: '09:00', end: '10:00', subject: 'Matemáticas' },
    { type: 'break', name: 'RECESO' },
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

export default function TeacherSchedulePage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const handleDayChange = (offset: number) => {
    setSelectedDayIndex((prevIndex) => {
      const newIndex = prevIndex + offset;
      if (newIndex < 0) return daysOfWeek.length - 1;
      if (newIndex >= daysOfWeek.length) return 0;
      return newIndex;
    });
  };

  const currentDayKey = daysOfWeek[selectedDayIndex].key;
  const currentSchedule = teacherScheduleData[currentDayKey] || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
            <CalendarClock className="h-7 w-7 text-muted-foreground" />
            <h1 className="text-2xl font-semibold text-foreground">Mi Horario Semanal</h1>
        </div>
        <Separator className="mt-4" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <Badge className="w-fit text-base font-semibold px-4 py-1.5 bg-muted text-muted-foreground hover:bg-muted">Mi Carga Académica</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border rounded-md p-1 bg-muted/50 mb-6">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => handleDayChange(-1)}>
              Anterior
            </Button>
            <div className="flex-grow text-center">
               <Button variant="default" className="w-32 shadow-md">
                  {daysOfWeek[selectedDayIndex].label}
               </Button>
            </div>
            <Button variant="ghost" className="text-muted-foreground" onClick={() => handleDayChange(1)}>
              Siguiente
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
              {currentSchedule.length > 0 ? currentSchedule.map((item, index) =>
                item.type === 'break' ? (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell colSpan={3} className="text-center font-semibold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 py-3">
                      {item.name}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={index}>
                    <TableCell>{(item as SchedulePeriod).start}</TableCell>
                    <TableCell>{(item as SchedulePeriod).end}</TableCell>
                    <TableCell>{(item as SchedulePeriod).subject}</TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    No hay clases programadas para este día.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
