
"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { course: "MAT301", avgGrade: 85, passRate: 92 },
  { course: "ART101", avgGrade: 78, passRate: 85 },
  { course: "CS101", avgGrade: 92, passRate: 95 },
  { course: "QUM202", avgGrade: 75, passRate: 80 },
  { course: "FIS201", avgGrade: 81, passRate: 88 }, 
];

const chartConfig = {
  avgGrade: {
    label: "Nota Prom.",
    color: "hsl(var(--chart-1))", // Updated to use chart colors from theme
  },
  passRate: {
    label: "Tasa Aprob.",
    color: "hsl(var(--chart-2))", // Updated to use chart colors from theme
  },
} satisfies ChartConfig;

export function CoursePerformanceChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle>Rendimiento de Cursos</CardTitle>
        <CardDescription>Nota promedio y tasa de aprobación por curso</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: -20, 
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="course"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="var(--color-avgGrade)"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                domain={[0, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--color-passRate)"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--accent)/0.3)' }} 
                content={<ChartTooltipContent 
                    indicator="dot" 
                    labelFormatter={(label, payload) => {
                        if (payload && payload.length) {
                           return payload[0].payload.course;
                        }
                        return label;
                    }}
                />} 
              />
              <Area
                yAxisId="left"
                dataKey="avgGrade"
                type="natural"
                fill="var(--color-avgGrade)"
                fillOpacity={0.3}
                stroke="var(--color-avgGrade)"
                stackId="a"
              />
              <Area
                yAxisId="right"
                dataKey="passRate"
                type="natural"
                fill="var(--color-passRate)"
                fillOpacity={0.3}
                stroke="var(--color-passRate)"
                stackId="b"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
