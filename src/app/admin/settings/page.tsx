
'use client';

import { useState, useEffect } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Settings, Save, Building, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { initialConfig, type SchoolConfig } from "@/lib/config";

export default function SettingsPage() {
    const { toast } = useToast();
    const [config, setConfig] = useState<SchoolConfig>(initialConfig);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // En una aplicación real, aquí se cargarían los datos desde una API.
        // Por ahora, usamos los datos iniciales del archivo de configuración.
        setConfig(initialConfig);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id.startsWith('social.')) {
            const socialKey = id.split('.')[1] as keyof SchoolConfig['social'];
            setConfig(prev => ({
                ...prev,
                social: { ...prev.social, [socialKey]: value }
            }));
        } else {
            setConfig(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Simular llamada a la API para guardar los cambios
            await new Promise(resolve => setTimeout(resolve, 1500));
            // En una app real, aquí se actualizaría el estado global o se recargarían los datos.
            // Por ahora, solo mostramos una notificación.
            console.log("Configuración guardada (simulación):", config);
            toast({
                title: "Configuración Guardada",
                description: "Los datos de la institución han sido actualizados.",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Error al Guardar",
                description: "No se pudo guardar la configuración. Por favor, inténtelo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

  return (
    <div className="space-y-6">
      <PageTitle title="Configuración" subtitle="Ajustes generales de la aplicación." icon={Settings} />
      
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Datos de la Institución</CardTitle>
          <CardDescription>Modifique la información principal de la escuela y los enlaces a redes sociales.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la Institución</Label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" value={config.name} onChange={handleChange} className="pl-10" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electrónico de Contacto</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" value={config.email} onChange={handleChange} className="pl-10" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" value={config.phone} onChange={handleChange} className="pl-10" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="address" value={config.address} onChange={handleChange} className="pl-10" />
                    </div>
                </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
                 <h3 className="text-md font-medium text-foreground">Redes Sociales</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="social.facebook">Facebook</Label>
                        <div className="relative">
                            <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="social.facebook" placeholder="https://facebook.com/usuario" value={config.social.facebook} onChange={handleChange} className="pl-10" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="social.twitter">Twitter / X</Label>
                        <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="social.twitter" placeholder="https://x.com/usuario" value={config.social.twitter} onChange={handleChange} className="pl-10" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="social.instagram">Instagram</Label>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="social.instagram" placeholder="https://instagram.com/usuario" value={config.social.instagram} onChange={handleChange} className="pl-10" />
                        </div>
                    </div>
                 </div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
