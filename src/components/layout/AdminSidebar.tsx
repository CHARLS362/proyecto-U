
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import React from 'react';
import { initialConfig } from '@/lib/config';

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
  { href: '/admin/news', label: 'Avisos', icon: Newspaper },
  { href: '/admin/calendar', label: 'Horario', icon: CalendarClock },
  { href: '/admin/curriculum', label: 'Programas de estudio', icon: LibraryBig },
];

const bottomNav = [
  { href: '/admin/settings', label: 'Configuraciones', icon: Settings },
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


export function AdminSidebar() {
  const pathname = usePathname();
  const schoolName = initialConfig.name;

  const getActiveAccordionItem = () => {
    if (managementNav.some(item => pathname.startsWith(item.href))) return 'gestion';
    if (academicNav.some(item => pathname.startsWith(item.href))) return 'academico';
    return '';
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group/logo">
          <LayoutGrid className="h-8 w-8 text-primary group-hover/logo:animate-pulse" /> 
          <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            {schoolName}
          </h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-2 space-y-1">
        <div className="px-2">
            <p className="px-4 py-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase group-data-[collapsible=icon]:hidden">
                PRINCIPAL
            </p>
            <SidebarMenu>
                {mainNav.map((item) => <NavItem key={item.href} {...item} />)}
            </SidebarMenu>
        </div>

        <Accordion type="single" collapsible defaultValue={getActiveAccordionItem()} className="w-full group-data-[collapsible=icon]:hidden">
          <AccordionItem value="gestion" className="border-none">
            <AccordionTrigger className="px-6 py-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase hover:no-underline hover:bg-sidebar-accent/50 rounded-md">
              Gestión
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              <SidebarMenu>
                {managementNav.map((item) => <NavItem key={item.href} {...item} />)}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="academico" className="border-none">
            <AccordionTrigger className="px-6 py-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase hover:no-underline hover:bg-sidebar-accent/50 rounded-md">
              Académico
            </AccordionTrigger>
            <AccordionContent className="pt-1">
              <SidebarMenu>
                {academicNav.map((item) => <NavItem key={item.href} {...item} />)}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Collapsed view for icon-only sidebar */}
        <div className="hidden group-data-[collapsible=icon]:block space-y-4">
            <SidebarMenu>
                {managementNav.map((item) => <NavItem key={item.href} {...item} />)}
            </SidebarMenu>
            <Separator className="bg-sidebar-border" />
            <SidebarMenu>
                {academicNav.map((item) => <NavItem key={item.href} {...item} />)}
            </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Usuario" data-ai-hint="user profile random" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">admin@sofiaeduca.com</p>
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
