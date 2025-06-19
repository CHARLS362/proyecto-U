
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SimpleMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgClass?: string;
  iconColorClass?: string;
}

export function SimpleMetricCard({ title, value, icon: Icon, iconBgClass, iconColorClass }: SimpleMetricCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${iconBgClass || 'bg-primary/10'}`}>
          <Icon className={`h-6 w-6 ${iconColorClass || 'text-primary'}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
