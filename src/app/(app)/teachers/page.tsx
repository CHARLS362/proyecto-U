
import { PageTitle } from "@/components/common/PageTitle";
import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Docentes" subtitle="Administre la información de los docentes." icon={Users} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Lista de Docentes</CardTitle>
          <CardDescription>Información detallada de los docentes registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la gestión de docentes se mostrará aquí.</p>
          {/* TODO: Add table or list of teachers */}
        </CardContent>
      </Card>
    </div>
  );
}
