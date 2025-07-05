
'use client';

import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Award, 
  FileText, 
  Filter, 
  Upload, 
  ChevronRight, 
  List, 
  Save, 
  ArrowLeft,
  Search,
  Database
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function QualificationsPage() {
  const [isEnteringGrades, setIsEnteringGrades] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const subjects = [
    { id: 1, name: "Hindi" },
    { id: 2, name: "Inglés" },
    { id: 3, name: "Matemáticas" },
    { id: 4, name: "Ciencias" },
    { id: 5, name: "Comercio" },
  ];

  const handleContinue = () => {
    setIsDialogOpen(false);
    setIsEnteringGrades(true);
  };

  const handleBack = () => {
    setIsEnteringGrades(false);
  };
  
  const UploadDialog = () => (
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
        <Button type="button" onClick={handleContinue}>
          Continuar <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <PageTitle title="Calificaciones" icon={Award} />
      
      <Tabs defaultValue="subir-calificaciones" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="subir-calificaciones">Subir calificaciones</TabsTrigger>
          <TabsTrigger value="ver-calificaciones">Ver calificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="subir-calificaciones" className="mt-6">
          {!isEnteringGrades ? (
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
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-auto p-6 flex flex-col items-center justify-center space-y-3 rounded-lg shadow-md bg-card hover:bg-muted/50 border-border cursor-pointer">
                        <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-md">
                          <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">Subir Calificaciones</span>
                      </Button>
                    </DialogTrigger>
                    <UploadDialog />
                  </Dialog>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="p-3">
                {/* Empty footer for spacing */}
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-lg animate-fade-in">
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
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <List className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Clase 12c A</h3>
                  </div>
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Número de rollo</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Puntuación total</TableHead>
                      <TableHead className="text-center">No</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1.</TableCell>
                      <TableCell>S1718791292</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="Estudiante kumar" data-ai-hint="robot avatar" />
                            <AvatarFallback>EK</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">Estudiante kumar</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">20</TableCell>
                      <TableCell className="text-center">
                        <Input type="number" defaultValue="11" className="w-24 mx-auto" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end pt-4 mt-4 border-t">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  <Save className="mr-2 h-4 w-4" />
                  Ahorrar
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ver-calificaciones" className="mt-6">
           <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Información</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="view-class">Clase</Label>
                    <Select defaultValue="11-comercio">
                      <SelectTrigger id="view-class">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12-comercio">12 (Comercio)</SelectItem>
                        <SelectItem value="11-comercio">11 (Comercio)</SelectItem>
                        <SelectItem value="10-arte">10 (Arte)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="view-section">Sección</Label>
                    <Select defaultValue="A">
                      <SelectTrigger id="view-section">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="view-session">Sesión</Label>
                    <Select defaultValue="2025-26">
                      <SelectTrigger id="view-session">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full md:w-auto">
                    <Search className="mr-2 h-4 w-4" />
                    Encontrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Exámenes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-accent/20 rounded-full mb-4">
                    <Database className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Sin registro</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
