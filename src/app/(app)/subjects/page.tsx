
import { PageTitle } from "@/components/common/PageTitle";
import { BookCopy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Temas/Asignaturas" subtitle="Administre los temas o asignaturas del plan de estudios." icon={BookCopy} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Lista de Temas</CardTitle>
          <CardDescription>Información sobre las asignaturas disponibles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la gestión de temas se mostrará aquí.</p>
          {/* TODO: Add table or list of subjects */}
        </CardContent>
      </Card>
    </div>
  );
}
