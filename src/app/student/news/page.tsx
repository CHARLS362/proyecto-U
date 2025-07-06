
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from "@/components/common/PageTitle";
import { mockNotices } from "@/lib/mockData";
import { Newspaper, User, Building, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentNewsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const statusMap: { [key: string]: { label: string, color: string } } = {
    urgente: { label: 'Urgente', color: 'bg-red-500/20 text-red-600 border-red-500/30' },
    informativo: { label: 'Informativo', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
    normal: { label: 'Normal', color: 'bg-green-500/20 text-green-600 border-green-500/30' },
    warning: { label: 'Advertencia', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' }
  };

  const getSenderIcon = (sender: string) => {
    if (sender.toLowerCase() === 'administración') {
      return <Building className="h-4 w-4" />;
    }
    return <User className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Tablón de Anuncios" subtitle="Las últimas noticias y avisos de la institución." icon={Newspaper} />
      
      {!isClient ? (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : mockNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {mockNotices.map((notice) => (
            <Card key={notice.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                  {statusMap[notice.status] && (
                    <Badge variant="secondary" className={statusMap[notice.status].color}>
                      {statusMap[notice.status].label}
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-2 pt-1 text-xs">
                  {getSenderIcon(notice.sender)}
                  <span>{notice.sender}</span>
                  <span className="mx-1">&bull;</span>
                  <span>{format(new Date(notice.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {notice.body ? (
                  <p className="text-sm text-muted-foreground">{notice.body}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hay más detalles.</p>
                )}
              </CardContent>
              {notice.file && (
                <CardFooter className="pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Archivo ({notice.file.name})
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No hay avisos</CardTitle>
            <CardDescription>No hay avisos recientes publicados.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
