
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Search, FileText, Database, Calendar as CalendarIcon, ClipboardCheck } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/common/PageTitle';

const primaryGrades = [
  { value: '1-pri', label: '1º de Primaria' },
  { value: '2-pri', label: '2º de Primaria' },
  { value: '3-pri', label: '3º de Primaria' },
  { value: '4-pri', label: '4º de Primaria' },
  { value: '5-pri', label: '5º de Primaria' },
  { value: '6-pri', label: '6º de Primaria' },
];

const secondaryGrades = [
  { value: '1-sec', label: '1º de Secundaria' },
  { value: '2-sec', label: '2º de Secundaria' },
  { value: '3-sec', label: '3º de Secundaria' },
  { value: '4-sec', label: '4º de Secundaria' },
  { value: '5-sec', label: '5º de Secundaria' },
];

export default function AttendancePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  return (
    <div className="space-y-6">
      <PageTitle title="Gestión de Asistencia" subtitle="Tome asistencia diaria o consulte registros históricos por fecha." icon={ClipboardCheck} />
      
      <Tabs defaultValue="tomar-asistencia" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-xs">
          <TabsTrigger value="tomar-asistencia">Tomar asistencia</TabsTrigger>
          <TabsTrigger value="asistencia-fecha">Asistencia por fecha</TabsTrigger>
        </TabsList>
        <TabsContent value="tomar-asistencia" className="mt-6">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Filtros de Asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div className="grid gap-2">
                    <Label htmlFor="level-take">Nivel</Label>
                    <Select value={selectedLevel} onValueChange={(value) => {
                        setSelectedLevel(value);
                        setSelectedGrade('');
                    }}>
                      <SelectTrigger id="level-take"><SelectValue placeholder="-- Nivel --" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primaria">Primaria</SelectItem>
                        <SelectItem value="secundaria">Secundaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="grade-take">Grado</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={!selectedLevel}>
                      <SelectTrigger id="grade-take"><SelectValue placeholder={!selectedLevel ? "Seleccione un nivel" : "-- Grado --"} /></SelectTrigger>
                      <SelectContent>
                        {selectedLevel === 'primaria' && primaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                        {selectedLevel === 'secundaria' && secondaryGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="section-take">Sección</Label>
                    <Select>
                      <SelectTrigger id="section-take"><SelectValue placeholder="-- Sección --" /></SelectTrigger>
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
              <CardHeader>
                <CardTitle className="text-lg">Lista de estudiantes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Número de rollo</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Asistencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1.</TableCell>
                      <TableCell>S1718791292</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="Estudiante" data-ai-hint="student avatar" />
                            <AvatarFallback>EK</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">Estudiante de Ejemplo</span>
                        </div>
                      </TableCell>
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
                  <Button>Guardar</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="asistencia-fecha" className="mt-6">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Buscar por Fecha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                   <div className="grid gap-2">
                    <Label htmlFor="level-find">Nivel</Label>
                     <Select>
                      <SelectTrigger id="level-find"><SelectValue placeholder="-- Nivel --" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primaria">Primaria</SelectItem>
                        <SelectItem value="secundaria">Secundaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="grade-find">Grado</Label>
                    <Select>
                      <SelectTrigger id="grade-find"><SelectValue placeholder="-- Grado --" /></SelectTrigger>
                      <SelectContent>
                        {/* Grade options here */}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="section-find">Sección</Label>
                    <Select>
                      <SelectTrigger id="section-find"><SelectValue placeholder="-- Sección --" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd/MM/yyyy") : <span>Seleccione una fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button className="w-full md:w-auto md:col-span-full lg:col-span-1">
                    <Search className="mr-2 h-4 w-4" />
                    Encontrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Hoja de asistencia</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Número de rollo</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* El estado vacío se muestra a continuación, por lo que no hay filas aquí */}
                        </TableBody>
                    </Table>
                     <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-accent/20 rounded-full mb-4">
                            <Database className="h-12 w-12 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Sin datos</h3>
                        <p className="text-sm text-muted-foreground">Utilice los filtros de arriba para buscar un registro.</p>
                    </div>
                </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
