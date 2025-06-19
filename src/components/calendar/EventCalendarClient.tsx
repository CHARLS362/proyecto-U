
"use client";

import * as React from "react";
import { addMonths, format, isSameDay, isSameMonth, startOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SchoolEvent } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EventCalendarClientProps {
  events: SchoolEvent[];
}

export function EventCalendarClient({ events }: EventCalendarClientProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(startOfMonth(month));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{format(currentMonth, "MMMM yyyy", { locale: es })}</CardTitle>
            <CardDescription>Seleccione un día para ver los eventos.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label="Mes anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label="Mes siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            locale={es}
            className="rounded-md border p-0"
            classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
            }}
            components={{
              DayContent: ({ date, displayMonth }) => {
                const dayEvents = events.filter(event => isSameDay(event.date, date) && isSameMonth(date, displayMonth));
                return (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <span>{format(date, "d")}</span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
                        {dayEvents.slice(0,3).map(event => (
                           <span key={event.id} className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: event.color || 'hsl(var(--primary))'}} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Eventos para {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "el día seleccionado"}
          </h3>
          {selectedDate ? (
            eventsForSelectedDate.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {eventsForSelectedDate.map((event) => (
                  <Popover key={event.id}>
                    <PopoverTrigger asChild>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex items-start gap-3" style={{borderColor: event.color}}>
                        <div className="mt-1.5 flex h-3 w-3 items-center justify-center rounded-full flex-shrink-0" style={{backgroundColor: event.color || 'hsl(var(--primary))'}}>
                           <span className="sr-only">Evento</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <Badge variant="outline" className="mt-1" style={{borderColor: event.color, color: event.color}}>{event.type}</Badge>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-card border-border shadow-xl">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none" style={{color: event.color || 'hsl(var(--primary))'}}>{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(event.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                          </p>
                        </div>
                        {event.description && <p className="text-sm">{event.description}</p>}
                        {event.location && <p className="text-sm text-muted-foreground"><strong>Lugar:</strong> {event.location}</p>}
                        <Badge variant="default" className="w-fit" style={{backgroundColor: event.color || 'hsl(var(--primary))', color: event.color ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary-foreground))'}}>{event.type}</Badge>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No hay eventos para esta fecha.</p>
            )
          ) : (
            <p className="text-sm text-muted-foreground italic">Seleccione un día en el calendario para ver los eventos.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
