
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Enero", students: 186 },
  { month: "Febrero", students: 205 },
  { month: "Marzo", students: 237 },
  { month: "Abril", students: 173 },
  { month: "Mayo", students: 209 },
  { month: "Junio", students: 214 },
]

const chartConfig = {
  students: {
    label: "Estudiantes",
    color: "hsl(var(--chart-1))", // Updated to use chart colors from theme
  },
} satisfies ChartConfig

export function EnrollmentChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle>Matrícula Mensual</CardTitle>
        <CardDescription>Nuevos estudiantes matriculados por mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                fontSize={12}
                tickFormatter={(value) => `${value}`} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--accent)/0.3)' }} 
                content={<ChartTooltipContent 
                    hideLabel 
                    formatter={(value, name, item) => (
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">{item.payload.month}</span>
                            <span className="font-bold" style={{color: chartConfig.students.color}}>{value} Estudiantes</span>
                        </div>
                    )}
                />} 
              />
              <Bar dataKey="students" fill="var(--color-students)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
