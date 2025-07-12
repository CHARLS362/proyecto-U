import { useState, useEffect } from 'react';

export interface Student {
  id: string;
  nombre: string;
  primer_nombre: string;
  apellido: string;
  url_avatar: string | null;
  correo: string;
  telefono: string | null;
  fecha_matricula: string;
  direccion: string | null;
  nivel: 'Primaria' | 'Secundaria';
  grado: number;
  nombre_tutor: string | null;
  contacto_tutor: string | null;
  fecha_nacimiento: string | null;
  genero: 'masculino' | 'femenino' | 'otro' | null;
  id_clase: string | null;
  seccion: string | null;
  departamento: string | null;
  ciudad: string | null;
  correo_tutor: string | null;
  direccion_tutor: string | null;
  fecha_nacimiento_tutor: string | null;
  clase_display?: string;
}

export interface CreateStudentData {
  identificador: string;
  nombre: string;
  apellido: string;
  padre: string;
  genero: string;
  clase_id: number;
  fecha_nacimiento: string;
  imagen?: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  estado: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/estudiantes');
      if (!response.ok) {
        throw new Error('Error al obtener los estudiantes');
      }
      
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: any) => {
    try {
      const response = await fetch('/api/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear estudiante');
      }

      await fetchStudents(); // Recargar la lista
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const updateStudent = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar estudiante');
      }

      await fetchStudents(); // Recargar la lista
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar estudiante');
      }

      await fetchStudents(); // Recargar la lista
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}; 