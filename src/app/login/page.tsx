
  'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import loginImg from '@/recursos/login.png';
import { initialConfig } from '@/lib/config';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const schoolName = initialConfig.name;
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setNotification({ type: 'success', message: 'Iniciando sesión...' });
    
    try {
      const success = await login(email, password);
      
      if (success) {
        setNotification({ type: 'success', message: '¡Inicio de sesión exitoso!' });
        // La redirección se maneja automáticamente en el hook useAuth
      } else {
        setNotification({ type: 'error', message: 'Credenciales inválidas' });
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      setNotification({ type: 'error', message: 'No se pudo conectar con el servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      {notification && (
        <div
          className={`fixed top-6 left-1/2 z-50 px-6 py-3 rounded shadow-lg text-base font-medium
            ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          style={{ transform: 'translateX(-50%)' }}
        >
          {notification.message}
        </div>
      )}

      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio
      </Link>
      <Card className="w-full max-w-4xl shadow-2xl overflow-hidden md:grid md:grid-cols-2 rounded-xl">
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-card">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground">Inicia Sesión</h1>
            <div className="mt-2 h-1 w-16 bg-primary mx-auto md:mx-0"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su Correo"
                  className="pl-10 bg-input/50 border-border focus:bg-card"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  className="pl-10 pr-10 bg-input/50 border-border focus:bg-card"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-sm text-right">
              <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-foreground text-background hover:bg-foreground/90 h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>

        <div className="hidden md:block relative">
          <Image
            src={loginImg}
            alt={`Bienvenido a ${schoolName}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-r-xl"
            data-ai-hint="anime student hero"
            placeholder="blur"
          />
        </div>
      </Card>
    </div>
  );
}
