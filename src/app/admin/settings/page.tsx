
import { PageTitle } from "@/components/common/PageTitle";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Configuración" subtitle="Ajustes generales de la aplicación." icon={Settings} />
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Preferencias de Cuenta</CardTitle>
          <CardDescription>Administre la información de su cuenta y las preferencias de notificación.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Contenido de configuración de cuenta aquí...</p>
        </CardContent>
      </Card>
       <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
          <CardDescription>Ajustes globales para la plataforma Sofía Educa.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Contenido de configuración del sistema aquí...</p>
        </CardContent>
      </Card>
    </div>
  );
}
