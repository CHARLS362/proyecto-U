
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
import * as React from "react"; // Import React for Fragment

const getPathBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);

  // If it's the root, go to dashboard
  if (pathname === '/') {
    return [{ href: '/dashboard', label: 'Panel' }];
  }

  // Define a mapping for labels to match sidebar
  const labelMapping: { [key: string]: string } = {
    dashboard: 'Panel',
    teachers: 'Docentes',
    students: 'Gestión de Estudiantes',
    subjects: 'Temas',
    attendance: 'Asistencias',
    news: 'Tabla de noticias',
    calendar: 'Horario',
    curriculum: 'Programas de estudio',
    grades: 'Notas',
    qualifications: 'Calificaciones',
    'bus-service': 'Servicio de Bus',
    settings: 'Configuraciones',
    new: 'Nuevo',
  };

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = labelMapping[segment.toLowerCase()] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { href, label };
  });

  // If the path isn't the dashboard itself, prepend the dashboard link.
  if (segments[0] !== 'dashboard') {
     return [{ href: '/dashboard', label: 'Panel' }, ...breadcrumbs];
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
              <React.Fragment key={crumb.href}>
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
      <Button variant="outline" size="icon" className="ml-auto shrink-0 md:ml-0">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificaciones</span>
      </Button>
    </header>
  );
}
