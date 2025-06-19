
import { PageTitle } from "@/components/common/PageTitle";
import { NotebookText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Notas" subtitle="Registre y consulte las notas de los estudiantes." icon={NotebookText} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Registro de Notas</CardTitle>
          <CardDescription>Visualice y administre las notas por curso y estudiante.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la gestión de notas se mostrará aquí.</p>
          {/* TODO: Add grade management interface */}
        </CardContent>
      </Card>
    </div>
  );
}
