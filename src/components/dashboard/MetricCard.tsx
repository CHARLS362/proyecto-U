
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  unit?: string;
  change?: string; // e.g., "+5%"
  changeType?: "positive" | "negative" | "neutral";
}

export function MetricCard({ title, value, description, icon: Icon, unit, change, changeType = "neutral" }: MetricCardProps) {
  const changeColorClass = 
    changeType === "positive" ? "text-green-600 dark:text-green-400" :
    changeType === "negative" ? "text-red-600 dark:text-red-400" :
    "text-muted-foreground";

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {value}
          {unit && <span className="text-xl font-normal ml-1">{unit}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {change && (
          <p className={`text-xs ${changeColorClass} pt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
