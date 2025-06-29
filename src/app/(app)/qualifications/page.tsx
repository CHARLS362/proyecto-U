
'use client';

import { PageTitle } from "@/components/common/PageTitle";
import { Award, FileText, Filter, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function QualificationsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Calificaciones" icon={Award} />
      
      <Tabs defaultValue="subir-calificaciones" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="subir-calificaciones">Subir calificaciones</TabsTrigger>
          <TabsTrigger value="ver-calificaciones">Ver calificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="subir-calificaciones" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Subir calificaciones</CardTitle>
              </div>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="flex justify-center items-center py-16">
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center justify-center space-y-3 rounded-lg shadow-md bg-card hover:bg-muted/50 border-border cursor-pointer">
                  <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-md">
                    <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-semibold text-foreground">Subir Calificaciones</span>
                </Button>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="p-3">
              {/* Empty footer for spacing */}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ver-calificaciones" className="mt-6">
           <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Ver Calificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">El contenido para ver calificaciones se mostrará aquí.</p>
                </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
