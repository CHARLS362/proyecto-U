
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
  BookCopy, 
  ClipboardCheck,
  Newspaper, 
  CalendarClock, 
  LibraryBig, 
  NotebookText, 
  Award, 
  Bus, 
  Settings,
  LogOut,
  School,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutGrid },
  { href: '/teachers', label: 'Docentes', icon: Users },
  { href: '/students', label: 'Gestión de Estudiantes', icon: GraduationCap },
  { href: '/subjects', label: 'Temas', icon: BookCopy },
  { href: '/attendance', label: 'Asistencias', icon: ClipboardCheck },
  { href: '/news', label: 'Tabla de noticias', icon: Newspaper },
  { href: '/calendar', label: 'Horario', icon: CalendarClock },
  { href: '/curriculum', label: 'Programas de estudio', icon: LibraryBig },
  { href: '/grades', label: 'Notas', icon: NotebookText },
  { href: '/qualifications', label: 'Calificaciones', icon: Award },
  { href: '/bus-service', label: 'Servicio de Bus', icon: Bus },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href || pathname ==='/';
    // For other main sections, allow startsWith for sub-pages
    if (navItems.some(item => item.href === href && href !== '/dashboard')) {
        return pathname.startsWith(href);
    }
    // For settings and logout, exact match
    if (href === '/settings' || href === '/logout') {
        return pathname === href;
    }
    return false;
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group/logo">
          <School className="h-8 w-8 text-primary group-hover/logo:animate-pulse" /> 
          <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">

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
            <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="user profile random" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">admin@academia.nova</p>
          </div>
        </div>
        <SidebarMenu className="mt-2">
           <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/settings')}
                  tooltip={{ children: 'Configuraciones', className:"bg-card text-card-foreground border-border shadow-md" }}
                  className="justify-start"
                >
                  <Link href="/settings">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">Configuraciones</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  // variant="destructive" // This variant is not standard in the CVA, custom classes handle destruction look
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
