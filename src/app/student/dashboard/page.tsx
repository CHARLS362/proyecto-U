
'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageTitle } from "@/components/common/PageTitle";
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";
import { mockStudents, mockEvents, mockNotices, type SchoolEvent } from "@/lib/mockData";
import { BookOpen, CalendarClock, Target, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Assuming we have the student's ID, e.g., 'S001' for Ana Pérez
const student = mockStudents.find(s => s.id === 'S001');
const recentNotices = mockNotices.slice(0, 2);

export default function StudentDashboardPage() {
    const [upcomingEvents, setUpcomingEvents] = React.useState<SchoolEvent[]>([]);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        // This effect runs only on the client, after the initial render
        const today = new Date();
        const filteredEvents = mockEvents.filter(event => event.date >= today).slice(0, 3);
        setUpcomingEvents(filteredEvents);
        setIsClient(true);
    }, []);


    if (!student) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Estudiante no encontrado.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 md:space-y-8">
            <PageTitle title="Panel del Estudiante" subtitle={`¡Bienvenida de nuevo, ${student.firstName}!`} />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SimpleMetricCard
                    title="Cursos Inscritos"
                    value={student.courses.length}
                    icon={BookOpen}
                    iconBgClass="bg-blue-100 dark:bg-blue-500/30"
                    iconColorClass="text-blue-500 dark:text-blue-300"
                />
                <SimpleMetricCard
                    title="Promedio General"
                    value="14.5"
                    icon={Target}
                    iconBgClass="bg-green-100 dark:bg-green-500/30"
                    iconColorClass="text-green-500 dark:text-green-300"
                />
                <SimpleMetricCard
                    title="Próximas Tareas"
                    value="3"
                    icon={CalendarClock}
                    iconBgClass="bg-yellow-100 dark:bg-yellow-500/30"
                    iconColorClass="text-yellow-500 dark:text-yellow-300"
                />
                 <SimpleMetricCard
                    title="Notificaciones"
                    value="2"
                    icon={Bell}
                    iconBgClass="bg-purple-100 dark:bg-purple-500/30"
                    iconColorClass="text-purple-500 dark:text-purple-300"
                />
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="shadow-lg animate-fade-in lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Mis Cursos</CardTitle>
                        <CardDescription>Tu progreso en los cursos actuales.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {student.courses.length > 0 ? (
                            <div className="space-y-6">
                                {student.courses.map(course => (
                                    <div key={course.id} className="p-4 border rounded-lg bg-muted/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-md text-primary">{course.name}</h4>
                                            <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} className="w-full h-2" />
                                        <Button variant="link" size="sm" asChild className="px-0 mt-1">
                                            <Link href={`/student/courses/${course.id}`}>Ir al curso</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No estás inscrito en ningún curso.</p>
                        )}
                    </CardContent>
                </Card>
                
                <Card className="shadow-lg animate-fade-in">
                    <CardHeader>
                        <CardTitle>Próximos Eventos y Avisos</CardTitle>
                        <CardDescription>Mantente al día.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                             <h4 className="text-sm font-semibold mb-2 text-foreground">Eventos</h4>
                             {!isClient ? (
                                <p className="text-xs text-muted-foreground">Cargando eventos...</p>
                             ) : upcomingEvents.length > 0 ? (
                                <ul className="space-y-3">
                                    {upcomingEvents.map(event => (
                                        <li key={event.id} className="flex items-center gap-3">
                                            <div className="p-2 bg-accent/20 rounded-md">
                                                <span className="font-bold text-sm text-accent-foreground">{format(event.date, 'd')}</span>
                                                <span className="text-xs text-accent-foreground/80">{format(event.date, 'MMM', { locale: es })}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">{event.type}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                             ) : (
                                <p className="text-xs text-muted-foreground">No hay eventos próximos.</p>
                             )}
                        </div>
                        <Separator />
                        <div>
                             <h4 className="text-sm font-semibold mb-2 text-foreground">Avisos Recientes</h4>
                             {!isClient ? (
                                <p className="text-xs text-muted-foreground">Cargando avisos...</p>
                             ) : recentNotices.length > 0 ? (
                                <ul className="space-y-3">
                                    {recentNotices.map(notice => (
                                        <li key={notice.id}>
                                            <p className="text-sm font-medium text-foreground">{notice.title}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">{notice.sender}</p>
                                                <Badge variant="outline" className="text-xs">{format(new Date(notice.date), "d MMM", { locale: es })}</Badge>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-muted-foreground">No hay avisos recientes.</p>
                             )}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
