
import { PageTitle } from "@/components/common/PageTitle";
import { Bus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusServicePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Servicio de Bus" subtitle="Información y gestión del transporte escolar." icon={Bus} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Rutas y Horarios</CardTitle>
          <CardDescription>Detalles del servicio de transporte.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido del servicio de bus se mostrará aquí.</p>
          {/* TODO: Add bus routes and schedule information */}
        </CardContent>
      </Card>
    </div>
  );
}
