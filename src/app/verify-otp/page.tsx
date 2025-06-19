
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ArrowLeft } from 'lucide-react'; // Using KeyRound for OTP

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for backend integration: Verify OTP
    console.log('OTP verification attempt with:', otp);
    // Simulate successful OTP verification and redirect to reset password page
    router.push('/reset-password'); 
  };

  const handleResendOtp = () => {
    // Placeholder for resend OTP logic
    console.log('Resend OTP requested');
    // Optionally, show a toast message: toast({ title: "Nuevo código enviado" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <Link href="/forgot-password" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Link>
      <Card className="w-full max-w-4xl shadow-2xl overflow-hidden md:grid md:grid-cols-2 rounded-xl">
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-card">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground">Verificar Código</h1>
            <p className="mt-2 text-muted-foreground">
              Ingresa el código de 6 dígitos enviado a tu correo electrónico.
            </p>
            <div className="mt-3 h-1 w-16 bg-primary mx-auto md:mx-0"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-muted-foreground">Código OTP</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="otp"
                  type="text" 
                  inputMode="numeric"
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  className="pl-10 bg-input/50 border-border focus:bg-card tracking-[0.5em] text-center"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Allow only digits
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 h-11 text-base">
              Verificar Código
            </Button>

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-medium text-primary hover:underline"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </form>
        </div>

        <div className="hidden md:flex relative items-center justify-center p-10 bg-gradient-to-br from-primary/20 to-accent/20 select-none">
          <Image
            src="https://placehold.co/600x800.png"
            alt="Verificar OTP"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-30"
            data-ai-hint="verification checkmark security"
          />
           <div className="relative z-10 text-center text-background drop-shadow-lg">
             <h2 className="text-4xl font-bold mb-2">ÚLTIMO PASO</h2>
            <p className="text-lg font-light">Estamos casi listos.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
