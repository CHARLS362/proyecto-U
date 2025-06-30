"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface AttendanceData {
  status: keyof ChartConfig;
  students: number;
  fill?: string;
}

interface AttendanceDoughnutChartProps {
  chartData: AttendanceData[];
  chartConfig: ChartConfig;
  className?: string;
}

export function AttendanceDoughnutChart({ chartData, chartConfig, className }: AttendanceDoughnutChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "mx-auto aspect-square max-h-[250px]"}
    >
      <PieChart>
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--accent)/0.3)' }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="students"
          nameKey="status"
          innerRadius="60%"
          outerRadius="80%"
          strokeWidth={2}
          paddingAngle={2}
        >
           {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartConfig[entry.status as keyof typeof chartConfig]?.color || "hsl(var(--muted))"} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
