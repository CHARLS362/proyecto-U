
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
  ClipboardCheck,
  NotebookText, 
  CalendarClock,
  Newspaper,
  LibraryBig,
  Award,
  Settings,
  LogOut,
  Hourglass,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { initialConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import React from 'react';

const navItems = [
  { href: '/teacher/dashboard', label: 'Panel', icon: LayoutGrid },
  { href: '/teacher/students', label: 'Mis Estudiantes', icon: Users },
  { href: '/teacher/attendance', label: 'Asistencia', icon: ClipboardCheck },
  { href: '/teacher/grades', label: 'Notas', icon: NotebookText },
  { href: '/teacher/qualifications', label: 'Calificaciones', icon: Award },
  { href: '/teacher/schedule', label: 'Mi Horario', icon: CalendarClock },
  { href: '/teacher/leave', label: 'Licencia', icon: Hourglass },
  { href: '/teacher/news', label: 'Avisos', icon: Newspaper },
  { href: '/teacher/curriculum', label: 'Programa de estudios', icon: LibraryBig },
];

const bottomNav = [
  { href: '/teacher/settings', label: 'Configuraciones', icon: Settings },
];

const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href.endsWith('dashboard')) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton
        asChild
        isActive={isActive(href)}
        tooltip={{ children: label, className: "bg-card text-card-foreground border-border shadow-md" }}
        className="justify-start data-[active=true]:font-bold data-[active=true]:text-sidebar-accent-foreground"
      >
        <Link href={href}>
          <Icon className="h-6 w-6 shrink-0 text-sidebar-primary" />
          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
        </Link>
      </SidebarMenuButton>
      <div 
        className={cn(
            "absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all duration-200",
            isActive(href) ? "h-6" : "group-hover:h-4"
        )}
      />
    </SidebarMenuItem>
  );
};


export function TeacherSidebar() {
  const schoolName = initialConfig.name;

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/teacher/dashboard" className="flex items-center gap-2 group/logo">
          <LayoutGrid className="h-8 w-8 text-primary group-hover/logo:animate-pulse" /> 
          <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {schoolName}
          </h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="teacher avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-sidebar-foreground">Juan Docente</p>
            <p className="text-xs text-muted-foreground">juan.docente@sofiaeduca.com</p>
          </div>
        </div>
        <Separator className="my-3 bg-sidebar-border" />
        <SidebarMenu>
           {bottomNav.map((item) => <NavItem key={item.href} {...item} />)}
             <SidebarMenuItem className="relative">
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Cerrar Sesión', className:"bg-destructive text-destructive-foreground border-border shadow-md" }}
                  className="justify-start hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:bg-destructive/20 group-data-[collapsible=icon]:hover:bg-destructive/30 group-data-[collapsible=icon]:text-destructive"
                >
                  <Link href="/logout">
                    <LogOut className="h-6 w-6 shrink-0" />
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
