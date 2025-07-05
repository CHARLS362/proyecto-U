
import { PageTitle } from "@/components/common/PageTitle";
import { Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentNewsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Tablón de Anuncios" subtitle="Las últimas noticias y avisos de la institución." icon={Newspaper} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Avisos Importantes</CardTitle>
          <CardDescription>Aquí verás los avisos publicados por la administración y los docentes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de los avisos se mostrará aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
