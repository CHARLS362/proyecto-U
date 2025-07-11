
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
  BookOpen,
  CalendarClock,
  Award,
  ClipboardCheck,
  Newspaper,
  Settings,
  LogOut,
  Hourglass,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { initialConfig } from '@/lib/config';

const navItems = [
  { href: '/student/dashboard', label: 'Panel', icon: LayoutGrid },
  { href: '/student/courses', label: 'Mis Cursos', icon: BookOpen },
  { href: '/student/schedule', label: 'Horario', icon: CalendarClock },
  { href: '/student/grades', label: 'Calificaciones', icon: Award },
  { href: '/student/attendance', label: 'Asistencia', icon: ClipboardCheck },
  { href: '/student/leave', label: 'Permisos', icon: Hourglass },
  { href: '/student/news', label: 'Avisos', icon: Newspaper },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const schoolName = initialConfig.name;

  const isActive = (href: string) => {
    if (href === '/student/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/student/dashboard" className="flex items-center gap-2 group/logo">
          <LayoutGrid className="h-8 w-8 text-primary group-hover/logo:animate-pulse" /> 
          <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            {schoolName}
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
            <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="student avatar" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-foreground">Ana Pérez</p>
            <p className="text-xs text-muted-foreground">ana.perez@example.com</p>
          </div>
        </div>
        <SidebarMenu className="mt-2">
           <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/student/settings')}
                  tooltip={{ children: 'Configuración', className:"bg-card text-card-foreground border-border shadow-md" }}
                  className="justify-start"
                >
                  <Link href="/student/settings">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">Configuración</span>
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
