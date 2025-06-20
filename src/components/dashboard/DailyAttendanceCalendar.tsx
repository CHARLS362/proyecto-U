'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceDoughnutChart, type AttendanceData } from './AttendanceDoughnutChart';
import { mockAttendanceStats } from "@/lib/mockData"; // Using global stats for now
import { cn } from '@/lib/utils';

export function DailyAttendanceCalendar({ className }: { className?: string }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // This needs to be defined here or imported if it's part of chartConfig in AttendanceDoughnutChart
  const chartConfig = {
    presente: { label: "Presente", color: "hsl(var(--chart-1))" },
    ausente: { label: "Ausente", color: "hsl(var(--chart-2))" },
    tarde: { label: "Tarde", color: "hsl(var(--chart-3))" },
    justificado: { label: "Justificado", color: "hsl(var(--chart-4))" },
  };

  // In a real app, you'd fetch or filter data based on selectedDate.
  // For now, the chart will show the same global data regardless of selectedDate.
  const chartDataForSelectedDate: AttendanceData[] = mockAttendanceStats.map(stat => ({
    ...stat,
    status: stat.status as keyof typeof chartConfig, // Ensure status matches ChartConfig keys
  }));


  return (
    <Card className={cn("shadow-lg animate-fade-in", className)}>
      <CardHeader>
        <CardTitle>Resumen de Asistencia Diario</CardTitle>
        <CardDescription>
          {selectedDate
            ? `Estadísticas para ${format(selectedDate, 'PPP', { locale: es })}`
            : 'Seleccione un día del calendario.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            locale={es}
            className="rounded-md border p-3 shadow-inner bg-muted/20"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground ring-2 ring-primary/70 dark:ring-accent-foreground/70",
              head_cell: "text-muted-foreground font-semibold w-10",
              cell: "w-10 h-10",
              day: "w-10 h-10 p-0",
            }}
          />
        </div>
        <div className="min-h-[300px] flex items-center justify-center">
          {selectedDate ? (
            <AttendanceDoughnutChart chartData={chartDataForSelectedDate} className="border-none shadow-none" />
          ) : (
             <div className="text-center text-muted-foreground p-4">
                <p>Seleccione una fecha en el calendario para ver el resumen de asistencia.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
