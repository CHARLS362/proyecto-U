
import { PageTitle } from "@/components/common/PageTitle";
import { Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QualificationsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Calificaciones" subtitle="Consulte las calificaciones y el rendimiento académico." icon={Award} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Boletín de Calificaciones</CardTitle>
          <CardDescription>Resumen del rendimiento de los estudiantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la gestión de calificaciones se mostrará aquí.</p>
          {/* TODO: Add qualifications display */}
        </CardContent>
      </Card>
    </div>
  );
}
