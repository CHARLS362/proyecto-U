'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendanceDoughnutChart } from './AttendanceDoughnutChart';
import { mockStudentAttendanceStats } from '@/lib/mockData';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  presente: { label: "Presente", color: "hsl(var(--chart-1))" },
  ausente: { label: "Ausente", color: "hsl(var(--chart-2))" },
  tarde: { label: "Tarde", color: "hsl(var(--chart-3))" },
  justificado: { label: "Justificado", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const chartData = mockStudentAttendanceStats.map(stat => ({
  ...stat,
  status: stat.status,
}));

export function StudentAttendanceChart() {
  const totalDays = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0);
  }, []);
  
  const presentPercentage = React.useMemo(() => {
    if (totalDays === 0) return 0;
    const presentDays = chartData.find(d => d.status === 'presente')?.students || 0;
    return Math.round((presentDays / totalDays) * 100);
  }, [totalDays]);

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle>Mi Asistencia</CardTitle>
        <CardDescription>Resumen de tu asistencia en el semestre.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="relative w-full max-w-[180px] aspect-square mx-auto">
                <AttendanceDoughnutChart chartData={chartData} chartConfig={chartConfig} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold">{presentPercentage}%</span>
                    <span className="text-xs text-muted-foreground">Presente</span>
                </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
                {chartData.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartConfig[item.status].color }} />
                        <span className="text-foreground/80 flex-1">{chartConfig[item.status].label}</span>
                        <span className='font-semibold text-foreground'>{item.students} días</span>
                    </div>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t mt-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                    <span className="text-foreground/80 flex-1 font-bold">Total Días</span>
                    <span className='font-semibold text-foreground'>{totalDays} días</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
