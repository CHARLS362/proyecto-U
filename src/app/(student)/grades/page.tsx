
import { PageTitle } from "@/components/common/PageTitle";
import { Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentGradesPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Mis Calificaciones" subtitle="Consulta tus notas y rendimiento académico." icon={Award} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Reporte de Calificaciones</CardTitle>
          <CardDescription>Aquí verás el detalle de tus calificaciones por curso.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de las calificaciones se mostrará aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
