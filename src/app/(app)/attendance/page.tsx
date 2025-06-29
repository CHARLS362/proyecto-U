
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, FileText, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="tomar-asistencia" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="tomar-asistencia">Tomar asistencia</TabsTrigger>
          <TabsTrigger value="asistencia-fecha">Asistencia según la fecha</TabsTrigger>
        </TabsList>
        <TabsContent value="tomar-asistencia" className="mt-6">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Mostrar asistencia</CardTitle>
                </div>
                <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="class">Clase</Label>
                    <Select defaultValue="12-comercio">
                      <SelectTrigger id="class">
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
                    <Label htmlFor="section">Sección</Label>
                    <Select defaultValue="A">
                      <SelectTrigger id="section">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
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

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Lista de estudiantes</CardTitle>
                </div>
                 <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Número de rollo</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Total de días</TableHead>
                      <TableHead className="text-center">Presente</TableHead>
                      <TableHead className="text-center">Porcentaje</TableHead>
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
                      <TableCell className="text-center">0</TableCell>
                      <TableCell className="text-center">0</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                            <Switch id="attendance-switch-1" />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline">Reiniciar</Button>
                  <Button>Entregar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="asistencia-fecha" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Asistencia por Fecha</CardTitle>
                <CardDescription>Esta funcionalidad se implementará pronto.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Aquí podrá ver los registros de asistencia filtrados por un rango de fechas.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
