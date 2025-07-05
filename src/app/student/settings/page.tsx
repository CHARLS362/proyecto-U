
import { PageTitle } from "@/components/common/PageTitle";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Configuración" subtitle="Ajustes de tu perfil y preferencias." icon={Settings} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Preferencias de Cuenta</CardTitle>
          <CardDescription>Administra la información de tu cuenta y las preferencias de notificación.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">El contenido de la configuración se mostrará aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
