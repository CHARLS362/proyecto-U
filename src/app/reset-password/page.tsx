
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      // In a real app, use a toast or an inline error message
      alert("Las contraseñas no coinciden."); 
      return;
    }
    // Placeholder for backend integration: Reset password
    console.log('Reset password attempt with new password:', newPassword);
    // Simulate successful password reset and redirect to login page
    // Optionally, show a success toast on the login page:
    // router.push('/login?reset=success');
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <Link href="/login" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio de sesión
      </Link>
      <Card className="w-full max-w-4xl shadow-2xl overflow-hidden md:grid md:grid-cols-2 rounded-xl">
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-card">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground">Crear Nueva Contraseña</h1>
            <p className="mt-2 text-muted-foreground">
              Asegúrate de que tu nueva contraseña sea segura.
            </p>
            <div className="mt-3 h-1 w-16 bg-primary mx-auto md:mx-0"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu nueva contraseña"
                  className="pl-10 pr-10 bg-input/50 border-border focus:bg-card"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu nueva contraseña"
                  className="pl-10 pr-10 bg-input/50 border-border focus:bg-card"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 h-11 text-base">
              Restablecer Contraseña
            </Button>
          </form>
        </div>

        <div className="hidden md:flex relative items-center justify-center p-10 bg-gradient-to-br from-primary/20 to-accent/20 select-none">
          <Image
            src="https://placehold.co/600x800.png"
            alt="Restablecer contraseña"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-30"
            data-ai-hint="password security shield"
          />
          <div className="relative z-10 text-center text-background drop-shadow-lg">
            <ShieldCheck className="mx-auto h-16 w-16 mb-4"/>
            <h2 className="text-4xl font-bold mb-2">SEGURIDAD PRIMERO</h2>
            <p className="text-lg font-light">Tu nueva contraseña está protegida.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
