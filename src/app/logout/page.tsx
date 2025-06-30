
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would clear tokens/session here.
    console.log("Cerrando sesión y redirigiendo...");
    const timer = setTimeout(() => {
        router.replace('/login');
    }, 1500); // Wait 1.5 seconds before redirecting

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-xl animate-fade-in">
            <CardHeader className="text-center">
            <LogOut className="mx-auto h-12 w-12 text-primary mb-4 animate-pulse" />
            <CardTitle className="text-2xl">Cerrando Sesión</CardTitle>
            <CardDescription>Será redirigido a la página de inicio de sesión.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center">Gracias por visitar Academia Nova.</p>
            </CardContent>
        </Card>
    </div>
  );
}
