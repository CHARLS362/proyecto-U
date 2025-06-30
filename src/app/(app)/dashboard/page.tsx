
import { PageTitle } from "@/components/common/PageTitle";
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";
import { mockNotices, mockReminders, mockRecentActivities } from "@/lib/mockData"; // Updated mockData import
import { 
  Users, Bookmark, Newspaper, StickyNote, Filter, Plus, Info, Trash2, LayoutGrid,
  UserPlus as UserPlusIcon, ClipboardEdit as ClipboardEditIcon, CalendarPlus as CalendarPlusIcon, Megaphone as MegaphoneIcon, FileText as FileTextIcon, MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DailyAttendanceCalendar } from "@/components/dashboard/DailyAttendanceCalendar"; // Changed import
import { cn } from "@/lib/utils";
import type { RecentActivity } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For potential use in recent activities


const noticeStatusColors: Record<string, string> = {
   urgente: "bg-red-500",
   informativo: "bg-green-500",
   normal: "bg-blue-500",
  warning: "bg-yellow-500",
};

const activityIconMap: Record<RecentActivity["icon"], React.ElementType> = {
  UserPlus: UserPlusIcon,
  ClipboardEdit: ClipboardEditIcon,
  CalendarPlus: CalendarPlusIcon,
  Megaphone: MegaphoneIcon,
  FileText: FileTextIcon,
};

const activityIconColor: Record<RecentActivity["icon"], string> = {
  UserPlus: "bg-blue-100 dark:bg-blue-500/30 text-blue-500 dark:text-blue-300",
  ClipboardEdit: "bg-yellow-100 dark:bg-yellow-500/30 text-yellow-500 dark:text-yellow-300",
  CalendarPlus: "bg-green-100 dark:bg-green-500/30 text-green-500 dark:text-green-300",
  Megaphone: "bg-purple-100 dark:bg-purple-500/30 text-purple-500 dark:text-purple-300",
  FileText: "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-500 dark:text-indigo-300",
}


export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageTitle title="Panel de Control" subtitle="Bienvenido a Sofía Educa" icon={LayoutGrid} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SimpleMetricCard
          title="Docentes"
          value="1"
          icon={Users}
          iconBgClass="bg-blue-100 dark:bg-blue-500/30"
          iconColorClass="text-blue-500 dark:text-blue-300"
        />
        <SimpleMetricCard
          title="Estudiantes"
          value="1"
          icon={Users}
          iconBgClass="bg-yellow-100 dark:bg-yellow-500/30"
          iconColorClass="text-yellow-500 dark:text-yellow-300"
        />
        <SimpleMetricCard
          title="Notas"
          value="2"
          icon={FileTextIcon}
          iconBgClass="bg-green-100 dark:bg-green-500/30"
          iconColorClass="text-green-500 dark:text-green-300"
        />
        <SimpleMetricCard
          title="Avisos"
          value="6"
          icon={Bookmark}
          iconBgClass="bg-red-100 dark:bg-red-500/30"
          iconColorClass="text-red-500 dark:text-red-300"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-lg animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Últimos Avisos</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {mockNotices.length > 0 ? (
              <ul className="space-y-3">
                {mockNotices.map((notice) => (
                  <li key={notice.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${noticeStatusColors[notice.status] || 'bg-gray-400'}`}></span>
                      <span className="text-sm font-medium text-foreground">{notice.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(new Date(notice.date), "dd 'de' MMM 'de' yyyy", { locale: es })}</span>
                      <Badge variant="outline" className="text-xs">{notice.sender}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No hay avisos recientes.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg animate-fade-in">
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

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5 mt-6">
        <DailyAttendanceCalendar className="lg:col-span-3" />
        
        <Card className="lg:col-span-2 shadow-lg animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
             <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </div>
            <Button variant="ghost" size="sm">Ver Todo</Button>
          </CardHeader>
          <CardContent>
            {mockRecentActivities.length > 0 ? (
              <ul className="space-y-4">
                {mockRecentActivities.slice(0, 5).map((activity) => {
                  const IconComponent = activityIconMap[activity.icon];
                  const iconColors = activityIconColor[activity.icon];
                  return (
                    <li key={activity.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                      <div className={cn("p-2 rounded-full", iconColors)}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">No hay actividad reciente.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
