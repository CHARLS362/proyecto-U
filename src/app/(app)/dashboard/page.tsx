
import { PageTitle } from "@/components/common/PageTitle";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EnrollmentChart } from "@/components/dashboard/EnrollmentChart";
import { CoursePerformanceChart } from "@/components/dashboard/CoursePerformanceChart";
import { mockStudents, mockCourses, mockEvents } from "@/lib/mockData";
import { Users, BookOpenText, CalendarClock, Percent, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardPage() {
  const totalStudents = mockStudents.length;
  const totalCourses = mockCourses.length;
  
  const averageAttendance = mockStudents.reduce((sum, student) => {
    const studentCoursesProgress = student.courses.reduce((courseSum, course) => courseSum + course.progress, 0);
    return sum + (student.courses.length > 0 ? studentCoursesProgress / student.courses.length : 0);
  }, 0) / totalStudents;

  const upcomingEvents = mockEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8">
      <PageTitle title="Dashboard Principal" subtitle="Bienvenido a Academia Nova" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Estudiantes" 
          value={totalStudents} 
          icon={Users} 
          description="Estudiantes activos en el sistema"
          change="+12 este mes"
          changeType="positive"
        />
        <MetricCard 
          title="Total Cursos" 
          value={totalCourses} 
          icon={BookOpenText} 
          description="Cursos ofrecidos actualmente"
        />
        <MetricCard 
          title="Asistencia Promedio" 
          value={averageAttendance.toFixed(1)} 
          unit="%" 
          icon={Percent} 
          description="Promedio general de asistencia"
          change="-2% vs semana pasada"
          changeType="negative"
        />
        <MetricCard 
          title="Eventos Próximos" 
          value={upcomingEvents.length} 
          icon={CalendarClock} 
          description="Eventos en los próximos 30 días"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EnrollmentChart />
        <CoursePerformanceChart />
      </section>
      
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {[
                  { user: "Ana Pérez", action: "actualizó su perfil.", time: "Hace 5 min", avatar: mockStudents[0]?.avatarUrl, type:"student"},
                  { user: "Dr. Eduardo López", action: "creó una nueva tarea en Matemáticas Avanzadas.", time: "Hace 2 horas", avatar: mockCourses[0]?.instructorAvatar, type:"instructor"},
                  { user: "Luis García", action: "se inscribió en Química Orgánica.", time: "Hace 1 día", avatar: mockStudents[1]?.avatarUrl, type:"student"},
                  { user: "Admin", action: "publicó un nuevo evento: Reunión de Padres.", time: "Hace 2 días", avatar: "https://placehold.co/40x40.png", type:"admin"},
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint={`${activity.type} avatar`} />
                      <AvatarFallback>{activity.user.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="mt-1 flex h-3 w-3 items-center justify-center rounded-full" style={{backgroundColor: event.color || 'hsl(var(--primary))'}}>
                      <span className="sr-only">Evento</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(event.date, "PPP", { locale: es })} {event.location && `- ${event.location}`}
                      </p>
                    </div>
                    <Badge variant="outline" style={{borderColor: event.color, color: event.color}}>{event.type}</Badge>
                  </div>
                ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No hay eventos próximos.</p>
            )}
             <Button asChild variant="link" className="w-full mt-4">
                <Link href="/calendar">Ver todos los eventos</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
