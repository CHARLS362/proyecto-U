
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewStudentRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la página principal de estudiantes, donde reside el modal de creación.
    router.replace('/students');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle>Redirigiendo...</CardTitle>
          <CardDescription>
            El formulario para agregar estudiantes ahora está en la página principal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
