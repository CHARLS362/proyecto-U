'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id: number;
  identificador: string;
  correo: string;
  rol: 'admin' | 'profesor' | 'estudiante' | 'propietario';
  tema: 'claro' | 'oscuro';
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, contrasena: string) => Promise<boolean>;
  logout: () => void;
  updateTheme: (tema: 'claro' | 'oscuro') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar si hay un usuario guardado en localStorage al cargar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('usuario');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsuario(data.usuario);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Redirigir según el rol del usuario
        setTimeout(() => {
          switch (data.usuario.rol) {
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'profesor':
              router.push('/teacher/dashboard');
              break;
            case 'estudiante':
              router.push('/student/dashboard');
              break;
            case 'propietario':
              router.push('/admin/dashboard'); // Los propietarios van al dashboard de admin
              break;
            default:
              router.push('/dashboard');
          }
        }, 1500);
        
        return true;
      } else {
        throw new Error(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  const updateTheme = async (tema: 'claro' | 'oscuro') => {
    if (usuario) {
      try {
        const response = await fetch('/api/user/theme', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: usuario.id, tema }),
        });

        if (response.ok) {
          const usuarioActualizado = { ...usuario, tema };
          setUsuario(usuarioActualizado);
          localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        } else {
          console.error('Error al actualizar tema en la base de datos');
        }
      } catch (error) {
        console.error('Error al actualizar tema:', error);
      }
    }
  };

  const value: AuthContextType = {
    usuario,
    isAuthenticated: !!usuario,
    isLoading,
    login,
    logout,
    updateTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 