
'use client';

import { useState, useMemo } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { CalendarClock, Book, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { mockStudents, mockCourses } from '@/lib/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type ScheduleEntry = {
  time: string;
  subject: string;
  instructor: string;
};

const daysOfWeek = [
  { key: 'lunes', label: 'LUNES' },
  { key: 'martes', label: 'MARTES' },
  { key: 'miercoles', label: 'MIÉRCOLES' },
  { key: 'jueves', label: 'JUEVES' },
  { key: 'viernes', label: 'VIERNES' },
];

const dayMapping: { [key: string]: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' } = {
  'Lun': 'lunes',
  'Mar': 'martes',
  'Mié': 'miercoles',
  'Jue': 'jueves',
  'Vie': 'viernes',
};

export default function StudentSchedulePage() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const scheduleByDay = useMemo(() => {
    // Assuming we are logged in as the first student
    const student = mockStudents[0];
    if (!student) return {};

    const enrolledCoursesDetails = student.courses
      .map(enrolledCourse => mockCourses.find(c => c.id === enrolledCourse.id))
      .filter((course): course is NonNullable<typeof course> => !!course);

    const initialSchedule: { [key: string]: ScheduleEntry[] } = {
      lunes: [], martes: [], miercoles: [], jueves: [], viernes: [],
    };

    enrolledCoursesDetails.forEach(course => {
      if (course.schedule) {
        const parts = course.schedule.split(' ');
        const time = parts.pop();
        if (!time) return;

        const days = parts.map(d => d.replace(',', ''));

        days.forEach(dayAbbr => {
          const dayKey = dayMapping[dayAbbr];
          if (dayKey) {
            initialSchedule[dayKey].push({
              time: time,
              subject: course.name,
              instructor: course.instructor,
            });
          }
        });
      }
    });

    // Sort each day's schedule by time
    for (const day in initialSchedule) {
      initialSchedule[day].sort((a, b) => a.time.localeCompare(b.time));
    }

    return initialSchedule;
  }, []);

  const handleDayChange = (offset: number) => {
    setSelectedDayIndex((prevIndex) => {
      const newIndex = prevIndex + offset;
      if (newIndex < 0) return daysOfWeek.length - 1;
      if (newIndex >= daysOfWeek.length) return 0;
      return newIndex;
    });
  };

  const currentDayKey = daysOfWeek[selectedDayIndex].key;
  const currentSchedule = scheduleByDay[currentDayKey] || [];

  return (
    <div className="space-y-6">
      <PageTitle title="Mi Horario" subtitle="Tu horario de clases semanal." icon={CalendarClock} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
          <CardDescription>Aquí verás tus clases para cada día de la semana.</CardDescription>
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
                    <TableRow>
                        <TableHead>Hora</TableHead>
                        <TableHead>Asignatura</TableHead>
                        <TableHead>Docente</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentSchedule.length > 0 ? (
                        currentSchedule.map((entry, index) => (
                            <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell className="font-medium text-primary">{entry.time}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Book className="h-4 w-4 text-muted-foreground" />
                                        <span>{entry.subject}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{entry.instructor}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-16">
                                No tienes clases programadas para este día. ¡Disfruta tu día libre!
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
