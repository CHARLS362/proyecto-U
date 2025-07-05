
import { PageTitle } from "@/components/common/PageTitle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Info, CheckCircle2, AlertTriangle, AlertCircle, Palette } from "lucide-react";

export default function StyleGuidePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Guía de Estilos" subtitle="Una vista previa de los componentes de la interfaz de usuario." icon={Palette} />
      
      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Alerta predeterminada</AlertTitle>
            <AlertDescription>
              Puede utilizar este componente para mostrar información neutral.
            </AlertDescription>
          </Alert>

          <Alert variant="primary">
            <Info className="h-4 w-4" />
            <AlertTitle>Alerta principal</AlertTitle>
            <AlertDescription>
              Puede utilizar este componente para mostrar información importante.
            </AlertDescription>
          </Alert>
          
          <Alert variant="secondary">
            <Info className="h-4 w-4" />
            <AlertTitle>Alerta secundaria</AlertTitle>
            <AlertDescription>
               Puede utilizar este componente para mostrar información secundaria.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Alerta de éxito</AlertTitle>
            <AlertDescription>
              Puede utilizar este componente para mostrar un mensaje de éxito.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alerta de advertencia</AlertTitle>
            <AlertDescription>
              Puede utilizar este componente para mostrar un mensaje de advertencia.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Alerta de peligro</AlertTitle>
            <AlertDescription>
              Puede utilizar este componente para mostrar un mensaje de error o peligro.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
