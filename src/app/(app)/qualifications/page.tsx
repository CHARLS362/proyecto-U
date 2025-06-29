'use client';

import { PageTitle } from "@/components/common/PageTitle";
import { Award, FileText, Filter, Upload, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QualificationsPage() {
  const subjects = [
    { id: 1, name: "Hindi" },
    { id: 2, name: "Inglés" },
    { id: 3, name: "Matemáticas" },
    { id: 4, name: "Ciencias" },
    { id: 5, name: "Comercio" },
  ];

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-auto p-6 flex flex-col items-center justify-center space-y-3 rounded-lg shadow-md bg-card hover:bg-muted/50 border-border cursor-pointer">
                      <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-md">
                        <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Subir Calificaciones</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Subir resultado</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exam-title">Título de Examen</Label>
                        <Input id="exam-title" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="class-select">Clase</Label>
                          <Select defaultValue="12-comercio">
                            <SelectTrigger id="class-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                              <SelectItem value="11-ciencia">11 (Ciencia)</SelectItem>
                              <SelectItem value="10-arte">10 (Arte)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="section-select">Seccion</Label>
                           <Select defaultValue="A">
                            <SelectTrigger id="section-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="total-marks">Calificación</Label>
                          <Input id="total-marks" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="passing-marks">Calificaciones aprobatorias</Label>
                          <Input id="passing-marks" />
                        </div>
                      </div>
                       <div className="grid gap-2">
                          <Label htmlFor="subject-select">Sujeto</Label>
                          <Select>
                            <SelectTrigger id="subject-select">
                              <SelectValue placeholder="--select--" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.name.toLowerCase()}>{subject.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        Continuar <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
