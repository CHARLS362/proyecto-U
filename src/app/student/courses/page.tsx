
import { PageTitle } from "@/components/common/PageTitle";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Mis Cursos" subtitle="Progreso y materiales de tus cursos." icon={BookOpen} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Cursos Actuales</CardTitle>
          <CardDescription>Aquí verás la lista de los cursos en los que estás inscrito.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de los cursos se mostrará aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
