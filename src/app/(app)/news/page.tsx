
import { PageTitle } from "@/components/common/PageTitle";
import { Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Tabla de Noticias" subtitle="Anuncios y noticias importantes de la institución." icon={Newspaper}>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Noticia
        </Button>
      </PageTitle>
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Últimas Noticias</CardTitle>
          <CardDescription>Manténgase informado con los anuncios recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la tabla de noticias se mostrará aquí.</p>
          {/* TODO: Add list or feed of news items */}
        </CardContent>
      </Card>
    </div>
  );
}
