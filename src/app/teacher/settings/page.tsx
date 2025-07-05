
'use client';

import {
  BadgeInfo,
  BookText,
  Calendar,
  Filter,
  Home,
  KeyRound,
  Mail,
  Phone,
  School,
  UploadCloud,
  User,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const InfoItem = ({
  icon: Icon,
  label,
  value,
  labelClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  labelClassName?: string;
}) => (
  <div className="flex items-center gap-4 text-sm">
    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    <span className={cn('w-36 font-semibold text-foreground', labelClassName)}>{label}</span>
    <span className="text-muted-foreground text-left flex-1">- {value}</span>
  </div>
);

export default function TeacherSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configuración del perfil</h1>
        <Button variant="ghost" size="icon">
          <Filter className="h-5 w-5" />
          <span className="sr-only">Opciones</span>
        </Button>
      </header>
      <Separator />

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Imagen de perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://placehold.co/128x128.png" alt="Maestro Kumar" data-ai-hint="teacher avatar" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <Button size="icon" className="h-12 w-12 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg">
                 <UploadCloud className="h-6 w-6" />
              </Button>
              <p className="text-xs text-muted-foreground text-center px-2">
                Para obtener mejores resultados, utilice una imagen de al menos 128 px por 128 px en formato .jpg
              </p>
            </CardContent>
          </Card>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_0_rgb(0,118,255,23%)]">
            <KeyRound className="mr-2 h-4 w-4" />
            Cambiar la contraseña
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Información del perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
                <InfoItem icon={BadgeInfo} label="UID" value="T1718791191" />
                <InfoItem icon={User} label="Nombre" value="Maestro Kumar" />
                <InfoItem icon={Calendar} label="Cumpleaños" value="19-06-2024" />
                <InfoItem icon={Mail} label="Correo electrónico" value="profesor@gmail.com" />
                <InfoItem icon={School} label="Clase" value="12c" />
                <InfoItem icon={BookText} label="Sección" value="A" />
                <InfoItem icon={Phone} label="Teléfono" value="7896541230" />
                <InfoItem icon={Users} label="Género" value="Masculino" />
                <InfoItem icon={Home} label="DIRECCIÓN" value="cerca de la casa del administrador" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
