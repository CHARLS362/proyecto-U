
"use client";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link';
import * as React from "react";
import { ThemeToggle } from '../common/ThemeToggle';

const getPathBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return [];
  
  const role = segments[0];
  const isRolePath = ['admin', 'teacher', 'student'].includes(role);
  
  if (!isRolePath) return [];

  const dashboardPath = `/${role}/dashboard`;

  const labelMapping: { [key: string]: string } = {
    dashboard: 'Panel',
    teachers: 'Docentes',
    students: 'Gestión de Estudiantes',
    subjects: 'Temas',
    attendance: 'Asistencias',
    news: 'Avisos',
    calendar: 'Horario',
    curriculum: 'Programa de estudios',
    grades: 'Notas',
    qualifications: 'Calificaciones',
    'bus-service': 'Servicio de Bus',
    settings: 'Configuración',
    new: 'Nuevo',
    courses: 'Mis Cursos',
    leave: 'Licencia',
    'style-guide': 'Guía de Estilos',
  };
  
  const breadcrumbs = [];
  if (segments.length > 1) {
      breadcrumbs.push({ href: dashboardPath, label: 'Panel' });
  }

  const pathSegments = segments.slice(1);

  pathSegments.forEach((segment, index) => {
    if (segment.toLowerCase() === 'dashboard' && index === 0) {
      if (breadcrumbs.length === 0) {
        breadcrumbs.push({ href: dashboardPath, label: 'Panel' });
      }
      return;
    }
    const href = `/${role}/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = labelMapping[segment.toLowerCase()] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    if (!breadcrumbs.find(b => b.href === href)) {
        breadcrumbs.push({ href, label });
    }
  });

  if (breadcrumbs.length === 0 && segments.length === 1) {
    breadcrumbs.push({ href: dashboardPath, label: 'Panel' });
  }

  return breadcrumbs;
};

export function AppHeader() {
  const pathname = usePathname();
  const breadcrumbs = getPathBreadcrumbs(pathname);
  
  const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Panel";


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <SidebarTrigger />
      
      <div className="hidden sm:block">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.href}-${index}`}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                       <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
         <h1 className="text-2xl font-semibold mt-1 sm:hidden">{pageTitle}</h1>
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <ThemeToggle />
      <Button variant="outline" size="icon" className="shrink-0">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificaciones</span>
      </Button>
    </header>
  );
}
