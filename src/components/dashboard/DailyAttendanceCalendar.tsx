
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
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    // This will only run on the client, after initial hydration
    setSelectedDate(new Date());
  }, []);


  const chartConfig = {
    presente: { label: "Presente", color: "hsl(var(--chart-1))" },
    ausente: { label: "Ausente", color: "hsl(var(--chart-2))" },
    tarde: { label: "Tarde", color: "hsl(var(--chart-3))" },
    justificado: { label: "Justificado", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  // By letting TypeScript infer the type of chartData, it retains the specific
  // literal union type for 'status', which makes the object access below type-safe.
  const chartData = mockAttendanceStats.map(stat => ({
    ...stat,
    status: stat.status,
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
      <CardContent className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 items-center p-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={es}
            className="rounded-md border p-2 shadow-inner bg-muted/20"
            formatters={{
              formatWeekdayName: (day) => format(day, 'EE', { locale: es }).slice(0, 2).toLowerCase(),
            }}
            classNames={{
              day_selected: "bg-accent text-accent-foreground hover:bg-accent/90 focus:bg-accent",
              day_today: "bg-background ring-1 ring-primary",
              head_cell: "text-muted-foreground font-semibold text-xs w-8",
              cell: "h-8 w-8 p-0",
              day: "h-8 w-8",
              caption_label: "text-sm font-semibold",
              nav_button: "h-7 w-7",
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
          {selectedDate ? (
            <>
              <div className='relative w-full max-w-[180px] aspect-square mx-auto'>
                 <AttendanceDoughnutChart chartData={chartData} chartConfig={chartConfig} />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold">{totalStudents}</span>
                    <span className="text-xs text-muted-foreground">Estudiantes</span>
                 </div>
              </div>

              <div className="w-full text-xs text-muted-foreground max-w-[220px]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {chartData.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig[item.status].color }} />
                      <span className="text-foreground/80 flex-1">{chartConfig[item.status].label}</span>
                      <span className='font-semibold text-foreground'>{item.students}</span>
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
