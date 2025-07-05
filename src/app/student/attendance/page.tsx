
import { PageTitle } from "@/components/common/PageTitle";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Mi Asistencia" subtitle="Revisa tu historial de asistencia a clases." icon={ClipboardCheck} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Historial de Asistencia</CardTitle>
          <CardDescription>Aquí verás tu registro de asistencia para cada curso.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la asistencia se mostrará aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
