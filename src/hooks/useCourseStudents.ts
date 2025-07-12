import { useState, useEffect, useCallback } from 'react';

export interface EnrolledStudent {
  id_estudiante: string;
  id_curso: string;
  progreso: number | null;
  nombre: string;
  primer_nombre: string;
  apellido: string;
  url_avatar: string | null;
  correo: string;
  nivel: string;
  grado: number;
  seccion: string | null;
}

export const useCourseStudents = (courseId: string) => {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/cursos/${courseId}/estudiantes`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los estudiantes del curso');
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchStudents();
    }
  }, [fetchStudents]);

  return { students, loading, error, fetchStudents };
}; 