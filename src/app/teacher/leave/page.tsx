
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
import { Calendar as CalendarIcon, Hourglass, Trash2, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';


const leaveRequests = [
    {
        id: 1,
        type: 'Licencia casual',
        requestDate: '19 de junio de 2024',
        status: 'rechazado',
        description: 'Quiero descansar un poco por favor dejame',
        dateRange: '29 de junio de 2024 - 3 de julio de 2024'
    },
    {
        id: 2,
        type: 'Licencia médica',
        requestDate: '19 de junio de 2024',
        status: 'aprobado',
        description: 'Adjunto certificado médico por gripe.',
        dateRange: '20 de junio de 2024 - 22 de junio de 2024'
    }
]

export default function LeavePage() {
    const { toast } = useToast();
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const statusColors: {[key: string]: string} = {
        rechazado: 'text-red-600 dark:text-red-400',
        aprobado: 'text-green-600 dark:text-green-400',
        pendiente: 'text-yellow-600 dark:text-yellow-400'
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        // Here you would get form data. For now, we simulate.
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast({
          title: "Solicitud Enviada",
          description: "Tu solicitud de permiso ha sido enviada para su revisión.",
          variant: "success"
        });
        // Here you would typically reset the form fields.
        setStartDate(undefined);
        setEndDate(undefined);
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        toast({
          title: "Error al Enviar",
          description: "No se pudo enviar la solicitud. Intente de nuevo.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
        <div className="space-y-6">
            <PageTitle title="Licencia y Permisos" icon={Hourglass} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <form onSubmit={handleSubmit}>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Nueva licencia</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="leave-type">Tipo de licencia</Label>
                                <Select>
                                    <SelectTrigger id="leave-type">
                                        <SelectValue placeholder="--seleccionar--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="casual">Licencia casual</SelectItem>
                                        <SelectItem value="medical">Licencia médica</SelectItem>
                                        <SelectItem value="personal">Licencia personal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="leave-description">Descripción de la licencia</Label>
                                <Textarea id="leave-description" className="min-h-[100px]" required />
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
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSubmitting ? 'Enviando...' : 'ENTREGAR'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Hourglass className="h-5 w-5" /> Hojas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {leaveRequests.map(request => (
                                <AccordionItem key={request.id} value={`item-${request.id}`}>
                                    <AccordionTrigger className="bg-primary/10 hover:bg-primary/20 px-4 rounded-md">
                                        <span className="font-medium text-primary">{request.type}</span>
                                        <span className="text-sm text-muted-foreground">{request.requestDate}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">ESTADO</h4>
                                            <p className={`font-bold ${statusColors[request.status]}`}>{request.status.toUpperCase()}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">DESCRIPCIÓN</h4>
                                            <p>{request.description}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">RANGO DE FECHAS</h4>
                                            <p>{request.dateRange}</p>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-xs text-muted-foreground">ACCIÓN</h4>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-end items-center gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm">anterior</Button>
                        <Button variant="default" size="sm">1</Button>
                        <Button variant="outline" size="sm">próximo</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
