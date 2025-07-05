
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
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/teacher/dashboard', label: 'Panel', icon: LayoutGrid },
  { href: '/teacher/students', label: 'Mis Estudiantes', icon: Users },
  { href: '/teacher/attendance', label: 'Asistencia', icon: ClipboardCheck },
  { href: '/teacher/grades', label: 'Calificaciones', icon: NotebookText },
  { href: '/teacher/schedule', label: 'Mi Horario', icon: CalendarClock },
  { href: '/teacher/news', label: 'Avisos', icon: Newspaper },
  { href: '/teacher/curriculum', label: 'Programa de estudios', icon: LibraryBig },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Check for dashboard specifically
    if (href === '/teacher/dashboard') return pathname === href;
    // For other sections, use startsWith to handle sub-pages
    return pathname.startsWith(href);
  };

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
      <Separator />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
               <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, className:"bg-card text-card-foreground border-border shadow-md" }}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="teacher avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-foreground">Juan Docente</p>
            <p className="text-xs text-muted-foreground">juan.docente@sofiaeduca.com</p>
          </div>
        </div>
        <SidebarMenu className="mt-2">
           <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/teacher/settings')}
                  tooltip={{ children: 'Configuraciones', className:"bg-card text-card-foreground border-border shadow-md" }}
                  className="justify-start"
                >
                  <Link href="/teacher/settings">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">Configuraciones</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Cerrar Sesión', className:"bg-destructive text-destructive-foreground border-border shadow-md" }}
                  className="justify-start group-data-[collapsible=icon]:bg-destructive/20 group-data-[collapsible=icon]:hover:bg-destructive/30 group-data-[collapsible=icon]:text-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                >
                  <Link href="/logout">
                    <LogOut />
                    <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
