
import { PageTitle } from "@/components/common/PageTitle";
import { SimpleMetricCard } from "@/components/dashboard/SimpleMetricCard";
import { mockNotices, mockReminders } from "@/lib/mockData"; // Updated mockData import
import { Users, FileText, Bookmark, Newspaper, StickyNote, Filter, Plus, Info, Trash2, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const noticeStatusColors: Record<string, string> = {
   urgente: "bg-red-500",
   informativo: "bg-green-500",
   normal: "bg-blue-500",
  warning: "bg-yellow-500",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageTitle title="Director del panel" subtitle="Analítica" icon={LayoutGrid} />

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
          icon={FileText}
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
    </div>
  );
}
