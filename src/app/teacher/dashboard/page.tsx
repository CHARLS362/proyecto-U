
import { PageTitle } from "@/components/common/PageTitle";
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";
import { mockReminders } from "@/lib/mockData";
import { Book, Users, CalendarCheck, Clock, StickyNote, Info, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockUpcomingClasses = [
    { time: '10:00 AM', subject: 'Matemáticas Avanzadas', class: '12 (Comercio)', room: 'Aula 301' },
    { time: '11:30 AM', subject: 'Historia del Arte', class: '10 (Arte)', room: 'Aula 105' },
    { time: '02:00 PM', subject: 'Programación Básica', class: '11 (Ciencia)', room: 'Lab C' },
]

const mockRecentNotices = [
    { id: '1', title: 'Reunión General de Docentes', date: 'Hace 2 horas', category: 'Reunión' },
    { id: '2', title: 'Actualización del plan de estudios de Ciencias', date: 'Ayer', category: 'Académico' },
    { id: '3', title: 'Recordatorio: Enviar calificaciones finales', date: 'Hace 3 días', category: 'Importante' },
]

export default function TeacherDashboardPage() {
    return (
        <div className="space-y-6 md:space-y-8">
            <PageTitle title="Panel del Docente" subtitle="Bienvenido, Juan Docente" />

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SimpleMetricCard
                    title="Mis Cursos"
                    value="4"
                    icon={Book}
                    iconBgClass="bg-blue-100 dark:bg-blue-500/30"
                    iconColorClass="text-blue-500 dark:text-blue-300"
                />
                <SimpleMetricCard
                    title="Total de Estudiantes"
                    value="87"
                    icon={Users}
                    iconBgClass="bg-yellow-100 dark:bg-yellow-500/30"
                    iconColorClass="text-yellow-500 dark:text-yellow-300"
                />
                <SimpleMetricCard
                    title="Asistencia Hoy"
                    value="95%"
                    icon={CalendarCheck}
                    iconBgClass="bg-green-100 dark:bg-green-500/30"
                    iconColorClass="text-green-500 dark:text-green-300"
                />
                <SimpleMetricCard
                    title="Clases de Hoy"
                    value="3"
                    icon={Clock}
                    iconBgClass="bg-purple-100 dark:bg-purple-500/30"
                    iconColorClass="text-purple-500 dark:text-purple-300"
                />
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="shadow-lg animate-fade-in">
                    <CardHeader>
                        <CardTitle>Clases de Hoy</CardTitle>
                        <CardDescription>Su horario para hoy, 24 de Julio de 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mockUpcomingClasses.length > 0 ? (
                            <ul className="space-y-4">
                                {mockUpcomingClasses.map((item, index) => (
                                    <li key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                                        <div className="flex flex-col items-center justify-center p-2 bg-primary/10 rounded-md w-20">
                                            <span className="font-bold text-lg text-primary">{item.time.split(' ')[0]}</span>
                                            <span className="text-xs text-primary/80">{item.time.split(' ')[1]}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-foreground">{item.subject}</h4>
                                            <p className="text-sm text-muted-foreground">{item.class} - {item.room}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Ver Detalles</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No tiene clases programadas para hoy.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-lg animate-fade-in">
                    <CardHeader>
                        <CardTitle>Avisos Recientes</CardTitle>
                        <CardDescription>Manténgase al día con las últimas noticias.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mockRecentNotices.length > 0 ? (
                            <ul className="space-y-3">
                                {mockRecentNotices.map((notice) => (
                                    <li key={notice.id} className="flex items-start justify-between p-3 rounded-md hover:bg-muted/50">
                                        <div>
                                            <p className="font-medium text-foreground">{notice.title}</p>
                                            <p className="text-xs text-muted-foreground">{notice.date}</p>
                                        </div>
                                        <Badge variant="secondary">{notice.category}</Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No hay avisos recientes.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-lg animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <StickyNote className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Recordatorios</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {mockReminders.length > 0 ? (
                        <ul className="space-y-3">
                            {mockReminders.map((reminder) => (
                            <li key={reminder.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors border-l-4" style={{ borderColor: reminder.color || 'hsl(var(--primary))' }}>
                                <Info className={`h-5 w-5 flex-shrink-0`} style={{ color: reminder.color || 'hsl(var(--primary))' }} />
                                <p className="text-sm text-foreground flex-grow">{reminder.text}</p>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p className="text-sm text-muted-foreground text-center py-10">No hay recordatorios.</p>
                        )}
                    </CardContent>
                </Card>
            </section>

        </div>
    );
}
