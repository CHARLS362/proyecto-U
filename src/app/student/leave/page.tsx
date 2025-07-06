
'use client';

import { useState } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Hourglass, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { mockStudentLeaveRequests } from '@/lib/mockData';


export default function LeavePage() {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const leaveRequests = mockStudentLeaveRequests;
    
    const statusBadgeColors: {[key: string]: string} = {
        rechazado: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700/50',
        aprobado: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700/50',
        pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700/50'
    }

    return (
        <div className="space-y-6">
            <PageTitle title="Solicitar Permiso" icon={Hourglass} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Nuevo Permiso</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="leave-type">Tipo de Permiso</Label>
                            <Select>
                                <SelectTrigger id="leave-type">
                                    <SelectValue placeholder="-- Seleccionar tipo --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="enfermedad">Enfermedad</SelectItem>
                                    <SelectItem value="familiar">Asunto Familiar</SelectItem>
                                    <SelectItem value="cita_medica">Cita Médica</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="leave-description">Motivo del Permiso</Label>
                            <Textarea id="leave-description" placeholder="Describa brevemente el motivo de su ausencia..." className="min-h-[100px]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start-date">Fecha de inicio</Label>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    id="start-date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "dd/MM/yyyy") : <span>dd/mm/aaaa</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                    locale={es}
                                    />
                                </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">Fecha de finalización</Label>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    id="end-date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "dd/MM/yyyy") : <span>dd/mm/aaaa</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    locale={es}
                                    />
                                </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">Enviar Solicitud</Button>
                    </CardFooter>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Hourglass className="h-5 w-5" /> Historial de Permisos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {leaveRequests.map(request => (
                                <AccordionItem key={request.id} value={`item-${request.id}`}>
                                    <AccordionTrigger className="hover:no-underline">
                                      <div className="flex justify-between items-center w-full pr-4">
                                        <span className="font-medium text-foreground">{request.type}</span>
                                        <Badge variant="outline" className={cn("capitalize", statusBadgeColors[request.status])}>
                                            {request.status}
                                        </Badge>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 space-y-3 bg-muted/30 rounded-md">
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">FECHA DE SOLICITUD</h4>
                                            <p className="text-sm">{request.requestDate}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">RANGO DE FECHAS</h4>
                                            <p className="text-sm">{request.dateRange}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">DESCRIPCIÓN</h4>
                                            <p className="text-sm">{request.description}</p>
                                        </div>
                                        {request.status !== 'pendiente' && (
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">ACCIÓN</h4>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-8 w-8">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Retirar solicitud</span>
                                            </Button>
                                        </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm">Anterior</Button>
                        <Button variant="default" size="sm">1</Button>
                        <Button variant="outline" size="sm">Siguiente</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
