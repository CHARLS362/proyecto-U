import { useState } from 'react';

export interface Enrollment {
  id: number;
  id_estudiante: string;
  id_curso: string;
  fecha_inscripcion: string;
  progreso: number;
  nombre_curso?: string;
  descripcion_curso?: string;
}

export const useEnrollment = (studentId: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/estudiantes/${studentId}/inscripciones`);
      if (!res.ok) throw new Error('Error fetching enrollments');
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const enrollStudent = async (id_curso: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/estudiantes/${studentId}/inscripciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_curso })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error enrolling student');
      }
      await fetchEnrollments();
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enrollments, loading, error, fetchEnrollments, enrollStudent };
}; 