
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart" 
import { mockAttendanceStats } from "@/lib/mockData" 
import { cn } from "@/lib/utils"; 

const defaultChartConfig = {
  presente: {
    label: "Presente",
    color: "hsl(var(--chart-1))",
  },
  ausente: {
    label: "Ausente",
    color: "hsl(var(--chart-2))",
  },
  tarde: {
    label: "Tarde",
    color: "hsl(var(--chart-3))",
  },
  justificado: {
    label: "Justificado",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export interface AttendanceData {
  status: keyof typeof defaultChartConfig;
  students: number;
  fill?: string; 
}

interface AttendanceDoughnutChartProps {
  className?: string;
  chartData?: AttendanceData[];
  chartConfig?: ChartConfig;
}

export function AttendanceDoughnutChart({ 
  className, 
  chartData = mockAttendanceStats, 
  chartConfig = defaultChartConfig 
}: AttendanceDoughnutChartProps) {
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0)
  }, [chartData])

  return (
    <Card className={cn("shadow-lg animate-fade-in flex flex-col h-full", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Asistencia del Día</CardTitle>
        <CardDescription>Distribución general</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--accent)/0.3)' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="students"
                nameKey="status"
                innerRadius="60%" // Makes it a doughnut
                outerRadius="80%" // Adjust for thickness
                strokeWidth={2} // Reduced stroke for a cleaner look
                paddingAngle={2} // Adds a little space between segments
                
              >
                 {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartConfig[entry.status as keyof typeof chartConfig]?.color || "hsl(var(--muted))"} />
                ))}
              </Pie>
               <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardContent className="mt-auto flex flex-col items-center justify-center gap-1 text-xs pt-0 pb-4">
         <div className="flex items-center gap-2 font-medium leading-none">
          Total de Estudiantes en Datos: {totalStudents}
        </div>
        {/* <div className="leading-none text-muted-foreground">
          Datos actualizados hoy
        </div> */}
      </CardContent>
    </Card>
  )
}
