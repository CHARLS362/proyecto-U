
import { PageTitle } from "@/components/common/PageTitle";
import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Mi Horario" subtitle="Tu horario de clases semanal." icon={CalendarClock} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
          <CardDescription>Aquí verás tus clases para cada día de la semana.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido del horario se mostrará aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
