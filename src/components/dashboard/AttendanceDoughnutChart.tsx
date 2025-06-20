
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart" // Added ChartTooltip
import { mockAttendanceStats } from "@/lib/mockData" // Assuming you'll add this to mockData
import { cn } from "@/lib/utils"; // Added this import

const chartConfig = {
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

interface AttendanceDoughnutChartProps {
  className?: string;
}

export function AttendanceDoughnutChart({ className }: AttendanceDoughnutChartProps) {
  const chartData = mockAttendanceStats;
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0)
  }, [chartData])

  return (
    <Card className={cn("shadow-lg animate-fade-in flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Resumen de Asistencia</CardTitle>
        <CardDescription>Distribución del estado de asistencia hoy</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0} // You can manage activeIndex with state for interactivity
                // activeShape an be a custom component
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
      <CardContent className="mt-auto flex flex-col items-center justify-center gap-2 text-xs pt-0">
         <div className="flex items-center gap-2 font-medium leading-none">
          Total de Estudiantes Registrados: {totalStudents}
        </div>
        <div className="leading-none text-muted-foreground">
          Datos actualizados hoy
        </div>
      </CardContent>
    </Card>
  )
}

