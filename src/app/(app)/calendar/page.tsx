
import { PageTitle } from "@/components/common/PageTitle";
import { EventCalendarClient } from "@/components/calendar/EventCalendarClient";
import { mockEvents } from "@/lib/mockData";
import { CalendarDays, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Calendario Escolar" subtitle="Eventos importantes, fechas límite y feriados." icon={CalendarDays}>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar Evento
        </Button>
      </PageTitle>
      
      <EventCalendarClient events={mockEvents} />
    </div>
  );
}
