
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutGrid, 
  Users,
  GraduationCap, 
  ClipboardCheck,
  Newspaper, 
  CalendarClock, 
  LibraryBig, 
  Award, 
  Settings,
  LogOut,
  BookOpenText,
  ClipboardEdit,
  MessageSquare,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const mainNav = [
  { href: '/admin/dashboard', label: 'Panel', icon: LayoutGrid },
];

const managementNav = [
  { href: '/admin/teachers', label: 'Docentes', icon: Users },
  { href: '/admin/students', label: 'Estudiantes', icon: GraduationCap },
  { href: '/admin/enrollment', label: 'Matrículas', icon: ClipboardEdit },
  { href: '/admin/courses', label: 'Cursos', icon: BookOpenText },
];

const academicNav = [
  { href: '/admin/attendance', label: 'Asistencias', icon: ClipboardCheck },
  { href: '/admin/qualifications', label: 'Calificaciones', icon: Award },
  { href: '/admin/grades', label: 'Retroalimentación', icon: MessageSquare },
];

const resourcesNav = [
  { href: '/admin/news', label: 'Avisos', icon: Newspaper },
  { href: '/admin/calendar', label: 'Horario', icon: CalendarClock },
  { href: '/admin/curriculum', label: 'Programas de estudio', icon: LibraryBig },
];

const bottomNav = [
  { href: '/admin/settings', label: 'Configuraciones', icon: Settings },
];

const NavGroup = ({ title, items }: { title: string, items: typeof mainNav }) => {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href.endsWith('dashboard')) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col gap-1">
      <p className="px-4 py-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase group-data-[collapsible=icon]:hidden">
        {title}
      </p>
      {items.map((item) => (
        <SidebarMenuItem key={item.href} className="relative">
           <SidebarMenuButton
            asChild
            isActive={isActive(item.href)}
            tooltip={{ children: item.label, className:"bg-card text-card-foreground border-border shadow-md" }}
            className="justify-start data-[active=true]:font-bold"
          >
            <Link href={item.href}>
              <item.icon />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </Link>
          </SidebarMenuButton>
          <div 
            className={cn(
                "absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all duration-200",
                isActive(item.href) ? "h-6" : "group-hover:h-4"
            )}
          />
        </SidebarMenuItem>
      ))}
    </div>
  );
};


export function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group/logo">
          <LayoutGrid className="h-8 w-8 text-primary group-hover/logo:animate-pulse" /> 
          <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            Sofía Educa
          </h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-2 space-y-4">
        <SidebarMenu>
            <NavGroup title="Principal" items={mainNav} />
        </SidebarMenu>
        <SidebarMenu>
            <NavGroup title="Gestión" items={managementNav} />
        </SidebarMenu>
        <SidebarMenu>
            <NavGroup title="Académico" items={academicNav} />
        </SidebarMenu>
        <SidebarMenu>
            <NavGroup title="Recursos" items={resourcesNav} />
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="user profile random" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">admin@sofiaeduca.com</p>
          </div>
        </div>
        <Separator className="my-3" />
        <SidebarMenu>
           {bottomNav.map((item) => (
                <SidebarMenuItem key={item.href} className="relative">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={{ children: item.label, className:"bg-card text-card-foreground border-border shadow-md" }}
                      className="justify-start data-[active=true]:font-bold"
                    >
                      <Link href={item.href}>
                          <item.icon />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                     <div 
                        className={cn(
                            "absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all duration-200",
                            isActive(item.href) ? "h-6" : "group-hover:h-4"
                        )}
                      />
                </SidebarMenuItem>
            ))}
             <SidebarMenuItem className="relative">
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Cerrar Sesión', className:"bg-destructive text-destructive-foreground border-border shadow-md" }}
                  className="justify-start hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:bg-destructive/20 group-data-[collapsible=icon]:hover:bg-destructive/30 group-data-[collapsible=icon]:text-destructive"
                >
                  <Link href="/logout">
                    <LogOut />
                    <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                  </Link>
                </SidebarMenuButton>
                 <div className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-destructive transition-all duration-200 group-hover:h-4"/>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
