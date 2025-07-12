
'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageTitle } from "@/components/common/PageTitle";
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";
import { BookOpen, CalendarClock, Target, Bell, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StudentAttendanceChart } from '@/components/dashboard/StudentAttendanceChart';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  nombre: string;
  progreso: number;
}

interface SchoolEvent {
  id: string;
  titulo: string;
  fecha: string;
  tipo: string;
}

interface Notice {
  titulo: string;
  fecha: string;
  remitente?: string;
}

interface Task {
  titulo: string;
  fecha_entrega: string;
  curso: string;
}

interface ApiResponse {
  cursos?: Course[];
  eventos?: SchoolEvent[];
  notificaciones?: { avisos: Notice[], anuncios: Notice[] };
  promedio?: { promedio_general: number };
  tareas?: Task[];
}

export default function StudentDashboardPage() {
    const { usuario } = useAuth();
    const [data, setData] = React.useState<ApiResponse>({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!usuario?.identificador) {
            setIsLoading(false);
            return;
        }

        const fetchData = async (endpoint: string) => {
            try {
                const res = await fetch(`/api/estudiantes/${usuario.identificador}/${endpoint}`);
                if (!res.ok) {
                    console.error(`Error fetching ${endpoint}:`, res.statusText);
                    return null;
                }
                return await res.json();
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);
                return null;
            }
        };

        const fetchAllData = async () => {
            setIsLoading(true);
            const [cursos, eventos, notificaciones, promedio, tareas] = await Promise.all([
                fetchData('cursos'),
                fetchData('eventos'),
                fetchData('notificaciones'),
                fetchData('promedio'),
                fetchData('tareas'),
            ]);
            setData({ cursos, eventos, notificaciones, promedio, tareas });
            setIsLoading(false);
        };

        fetchAllData();
    }, [usuario?.identificador]);

    const { cursos = [], eventos = [], notificaciones, promedio, tareas = [] } = data;
    const allNotices = [...(notificaciones?.avisos || []), ...(notificaciones?.anuncios || [])].slice(0, 4);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!usuario) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Por favor inicie sesión para ver su panel.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 md:space-y-8">
            <PageTitle title="Panel del Estudiante" subtitle={`¡Bienvenida de nuevo, ${usuario.correo}!`} />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/student/courses" className="block hover:-translate-y-1 transition-transform duration-200">
                    <SimpleMetricCard
                        title="Cursos Inscritos"
                        value={cursos.length}
                        icon={BookOpen}
                        iconBgClass="bg-blue-100 dark:bg-blue-500/30"
                        iconColorClass="text-blue-500 dark:text-blue-300"
                    />
                </Link>
                <Link href="/student/grades" className="block hover:-translate-y-1 transition-transform duration-200">
                    <SimpleMetricCard
                        title="Promedio General"
                        value={promedio?.promedio_general || 'N/A'}
                        icon={Target}
                        iconBgClass="bg-green-100 dark:bg-green-500/30"
                        iconColorClass="text-green-500 dark:text-green-300"
                    />
                </Link>
                <Link href="/student/courses" className="block hover:-translate-y-1 transition-transform duration-200">
                    <SimpleMetricCard
                        title="Próximas Tareas"
                        value={tareas.length}
                        icon={CalendarClock}
                        iconBgClass="bg-yellow-100 dark:bg-yellow-500/30"
                        iconColorClass="text-yellow-500 dark:text-yellow-300"
                    />
                </Link>
                 <Link href="/student/news" className="block hover:-translate-y-1 transition-transform duration-200">
                    <SimpleMetricCard
                        title="Notificaciones"
                        value={allNotices.length}
                        icon={Bell}
                        iconBgClass="bg-purple-100 dark:bg-purple-500/30"
                        iconColorClass="text-purple-500 dark:text-purple-300"
                    />
                </Link>
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="shadow-lg animate-fade-in lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Mis Cursos</CardTitle>
                        <CardDescription>Tu progreso en los cursos actuales.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {cursos.length > 0 ? (
                            <div className="space-y-6">
                                {cursos.map(course => (
                                    <div key={course.id} className="p-4 border rounded-lg bg-muted/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-md text-primary">{course.nombre}</h4>
                                            <span className="text-sm font-medium text-foreground">{course.progreso}%</span>
                                        </div>
                                        <Progress value={course.progreso} className="w-full h-2" />
                                        <Button variant="link" size="sm" asChild className="px-0 mt-1">
                                            <Link href={`/student/courses/${course.id}`}>Ir al curso</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No estás inscrito en ningún curso.</p>
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
                             {eventos.length > 0 ? (
                                <ul className="space-y-3">
                                    {eventos.map(event => (
                                        <li key={event.id} className="flex items-center gap-3">
                                            <div className="flex flex-col items-center justify-center p-2 bg-accent/20 rounded-md w-12 text-center">
                                                <span className="font-bold text-sm text-accent-foreground">{format(new Date(event.fecha), 'd')}</span>
                                                <span className="text-xs text-accent-foreground/80 uppercase">{format(new Date(event.fecha), 'MMM', { locale: es })}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{event.titulo}</p>
                                                <p className="text-xs text-muted-foreground">{event.tipo}</p>
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
                             {allNotices.length > 0 ? (
                                <ul className="space-y-3">
                                    {allNotices.map((notice, index) => (
                                        <li key={index}>
                                            <p className="text-sm font-medium text-foreground">{notice.titulo}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">{notice.remitente || 'Anuncio'}</p>
                                                <Badge variant="outline" className="text-xs">{format(new Date(notice.fecha), "d MMM", { locale: es })}</Badge>
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
            
            <section className="grid grid-cols-1">
                <StudentAttendanceChart />
            </section>

        </div>
    );
}
