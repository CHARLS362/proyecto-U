import { useState, useEffect } from 'react';

export interface Teacher {
  id: string;
  primer_nombre: string;
  apellido: string;
  url_avatar: string | null;
  correo: string;
  numero_telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: string | null;
  genero: string | null;
  clase: string | null;
  seccion: string | null;
  materia_relacionada: string | null;
  contacto_referencia: string | null;
  relacion_referencia: string | null;
  estado: 'Activo' | 'Inactivo';
  // Campos adicionales para compatibilidad con el frontend
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  status?: string;
  classDisplay?: string;
  section?: string;
  relatedSubject?: string;
  gender?: string;
  dob?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  refContact?: string;
  refRelationship?: string;
  clase_display?: string;
}

export interface CreateTeacherData {
  primer_nombre: string;
  apellido: string;
  correo: string;
  url_avatar?: string;
  numero_telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  clase?: string;
  seccion?: string;
  materia_relacionada?: string;
  contacto_referencia?: string;
  relacion_referencia?: string;
  estado?: 'Activo' | 'Inactivo';
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/maestros');
      if (!response.ok) {
        throw new Error('Error al obtener los maestros');
      }
      
      const data = await response.json();
      console.log('Respuesta cruda de la API de profesores:', data);
      if (Array.isArray(data) && data.length > 0) {
        console.log('Primer objeto recibido:', data[0]);
      }
      
      // Mapear los datos de la API a la estructura exacta del schema.sql
      const mappedTeachers: Teacher[] = data.map((profesor: any) => ({
        // Campos exactos del schema
        id: profesor.id,
        primer_nombre: profesor.primer_nombre || '',
        apellido: profesor.apellido || '',
        url_avatar: profesor.url_avatar || null,
        correo: profesor.correo || '',
        numero_telefono: profesor.numero_telefono || null,
        direccion: profesor.direccion || null,
        fecha_nacimiento: profesor.fecha_nacimiento || null,
        genero: profesor.genero || null,
        clase: profesor.clase || null,
        seccion: profesor.seccion || null,
        materia_relacionada: profesor.materia_relacionada || null,
        contacto_referencia: profesor.contacto_referencia || null,
        relacion_referencia: profesor.relacion_referencia || null,
        estado: profesor.estado || 'Activo',
        // Campos adicionales para compatibilidad con el frontend
        firstName: profesor.primer_nombre || '',
        lastName: profesor.apellido || '',
        avatarUrl: profesor.url_avatar || '/default-avatar.png',
        status: profesor.estado || 'Activo',
        classDisplay: profesor.clase_display || '',
        section: profesor.seccion || '',
        relatedSubject: profesor.materia_relacionada || '',
        gender: profesor.genero || '',
        dob: profesor.fecha_nacimiento || '',
        phoneNumber: profesor.numero_telefono || '',
        email: profesor.correo || '',
        address: profesor.direccion || '',
        refContact: profesor.contacto_referencia || '',
        refRelationship: profesor.relacion_referencia || '',
        clase_display: profesor.clase_display || '',
      }));
      
      setTeachers(mappedTeachers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createTeacher = async (teacherData: CreateTeacherData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/maestros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el maestro');
      }

      const result = await response.json();
      
      // Recargar la lista de maestros después de crear uno nuevo
      await fetchTeachers();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateTeacher = async (id: string, updateData: Partial<CreateTeacherData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/maestros/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el maestro');
      }

      const result = await response.json();
      
      // Recargar la lista de maestros después de actualizar
      await fetchTeachers();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/maestros/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el maestro');
      }

      const result = await response.json();
      
      // Recargar la lista de maestros después de eliminar
      await fetchTeachers();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}; 