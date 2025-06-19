
import { PageTitle } from "@/components/common/PageTitle";
import { LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogoutPage() {
  // In a real app, this page would handle the logout logic (e.g., clearing session, redirecting)
  // For this demo, it's a static page.

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <LogOut className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl">Cerrar Sesión</CardTitle>
          <CardDescription>¿Está seguro de que desea cerrar sesión?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full" onClick={() => alert("Sesión cerrada (simulado)")}>
            Sí, cerrar sesión
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Cancelar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
