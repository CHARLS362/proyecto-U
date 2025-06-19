
import { Users, Filter, UserPlus, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight animate-fade-in">
        Maestro
      </h1>

      <Tabs defaultValue="agregar" className="w-full animate-fade-in" style={{animationDelay: '100ms'}}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:max-w-lg">
          <TabsTrigger value="agregar">Agregar profesor</TabsTrigger>
          <TabsTrigger value="mostrar">Mostrar profesores</TabsTrigger>
          <TabsTrigger value="historial">Los profesores se van</TabsTrigger>
        </TabsList>

        <TabsContent value="agregar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl">Profesores</CardTitle>
              </div>
              <Button variant="ghost" size="icon" aria-label="Filtrar profesores">
                <Filter className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-primary/50"
                  // onClick={() => console.log("Agregar Maestro")}
                >
                  <div className="bg-green-100 dark:bg-green-500/20 p-5 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-500/30 transition-colors">
                    <UserPlus className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Agregar Maestro
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center justify-center space-y-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group border-border hover:border-destructive/50"
                  // onClick={() => console.log("Eliminar Maestro")}
                >
                  <div className="bg-red-100 dark:bg-red-500/20 p-5 rounded-xl group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-colors">
                    <UserMinus className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground group-hover:text-destructive transition-colors">
                    Eliminar Maestro
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mostrar" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Mostrar Profesores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí se mostrará la lista de profesores activos. (Contenido pendiente)
              </p>
              {/* TODO: Implement table or list of teachers */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Los Profesores Que Se Van</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí se mostrará el historial o la gestión de los profesores que han dejado la institución. (Contenido pendiente)
              </p>
              {/* TODO: Implement history or management for departing teachers */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
