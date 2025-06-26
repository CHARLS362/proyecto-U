'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceDoughnutChart, type AttendanceData } from './AttendanceDoughnutChart';
import { mockAttendanceStats } from "@/lib/mockData";
import { cn } from '@/lib/utils';
import type { ChartConfig } from '@/components/ui/chart';

export function DailyAttendanceCalendar({ className }: { className?: string }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  React.useEffect(() => {
    setSelectedDate(new Date());
  }, []);


  const chartConfig = {
    presente: { label: "Presente", color: "hsl(var(--chart-1))" },
    ausente: { label: "Ausente", color: "hsl(var(--chart-2))" },
    tarde: { label: "Tarde", color: "hsl(var(--chart-3))" },
    justificado: { label: "Justificado", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  // In a real app, you'd fetch or filter data based on selectedDate.
  const chartData: AttendanceData[] = mockAttendanceStats.map(stat => ({
    ...stat,
    status: stat.status as keyof typeof chartConfig, // Ensure status matches ChartConfig keys
  }));

  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0)
  }, [chartData])

  return (
    <Card className={cn("shadow-lg animate-fade-in flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Resumen de Asistencia Diario</CardTitle>
        <CardDescription>
          {selectedDate
            ? `Estadísticas para ${format(selectedDate, 'PPP', { locale: es })}`
            : 'Seleccione un día del calendario.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid flex-grow grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex justify-center items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            locale={es}
            className="rounded-md border p-3 shadow-inner bg-muted/20"
            classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary",
                day_today: "bg-accent text-accent-foreground ring-2 ring-primary/50",
                head_cell: "text-muted-foreground font-semibold text-xs",
                cell: "h-9 w-9 p-0", // Reduced padding
                day: "h-9 w-9",
                caption_label: "text-sm font-semibold",
                nav_button: "h-8 w-8",
              }}
          />
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          {selectedDate ? (
            <>
              <div className='relative w-full max-w-[200px] aspect-square mx-auto'>
                 <AttendanceDoughnutChart chartData={chartData} chartConfig={chartConfig} />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold">{totalStudents}</span>
                    <span className="text-xs text-muted-foreground">Estudiantes</span>
                 </div>
              </div>

              <div className="w-full text-xs text-muted-foreground">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {Object.entries(chartConfig).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: value.color }} />
                      <span className="font-medium flex-1">{value.label}</span>
                      <span className='font-semibold'>{chartData.find(d => d.status === key)?.students || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
             <div className="text-center text-muted-foreground p-4 h-full flex items-center justify-center">
                <p>Seleccione una fecha para ver el resumen.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
