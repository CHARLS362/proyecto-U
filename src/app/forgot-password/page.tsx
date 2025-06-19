
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for backend integration: Send OTP email
    console.log('Forgot password attempt for email:', email);
    // Simulate sending OTP and redirect to verify OTP page
    router.push('/verify-otp'); 
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
            <h1 className="text-3xl font-bold text-foreground">Recuperar Contraseña</h1>
            <p className="mt-2 text-muted-foreground">
              Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </p>
            <div className="mt-3 h-1 w-16 bg-primary mx-auto md:mx-0"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="pl-10 bg-input/50 border-border focus:bg-card"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 h-11 text-base">
              Enviar Código
            </Button>
          </form>
        </div>

        <div className="hidden md:flex relative items-center justify-center p-10 bg-gradient-to-br from-primary/20 to-accent/20 select-none">
          <Image
            src="https://placehold.co/600x800.png"
            alt="Recuperar contraseña"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-30"
            data-ai-hint="security lock key"
          />
          <div className="relative z-10 text-center text-background drop-shadow-lg">
             <h2 className="text-4xl font-bold mb-2">¿CONTRASEÑA OLVIDADA?</h2>
            <p className="text-lg font-light">No te preocupes, te ayudaremos.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
