
import { PageTitle } from "@/components/common/PageTitle";
import { LibraryBig } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CurriculumPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Programas de Estudio" subtitle="Detalles de los programas y planes de estudio." icon={LibraryBig} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Planes Curriculares</CardTitle>
          <CardDescription>Información sobre los diferentes programas académicos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de los programas de estudio se mostrará aquí.</p>
          {/* TODO: Add details about curriculum */}
        </CardContent>
      </Card>
    </div>
  );
}
