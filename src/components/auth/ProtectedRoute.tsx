'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'profesor' | 'estudiante' | 'propietario')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuario, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (allowedRoles && usuario && !allowedRoles.includes(usuario.rol)) {
        // Redirigir según el rol del usuario si no tiene permisos
        switch (usuario.rol) {
          case 'admin':
          case 'propietario':
            router.push('/admin/dashboard');
            break;
          case 'profesor':
            router.push('/teacher/dashboard');
            break;
          case 'estudiante':
            router.push('/student/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, usuario, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && usuario && !allowedRoles.includes(usuario.rol)) {
    return null;
  }

  return <>{children}</>;
} 