import { useState, useEffect } from 'react';

export interface Course {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  horario: string | null;
  instructor: string | null;
  id_instructor: string | null;
  avatar_instructor: string | null;
  cantidad_estudiantes_matriculados: number;
  capacidad: number;
  departamento: string | null;
  url_plan_estudios: string | null;
  id_clase: string | null;
}

export interface CreateCourseData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  horario?: string;
  instructor?: string;
  id_instructor?: string;
  avatar_instructor?: string;
  cantidad_estudiantes_matriculados: number;
  capacidad: number;
  departamento?: string;
  url_plan_estudios?: string;
  id_clase?: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cursos');
      if (!response.ok) {
        throw new Error('Error al obtener los cursos');
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: CreateCourseData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el curso');
      }

      const result = await response.json();
      
      // Recargar la lista de cursos después de crear uno nuevo
      await fetchCourses();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateCourse = async (id: string, updateData: Partial<CreateCourseData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el curso');
      }

      const result = await response.json();
      
      // Recargar la lista de cursos después de actualizar
      await fetchCourses();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el curso');
      }

      const result = await response.json();
      
      // Recargar la lista de cursos después de eliminar
      await fetchCourses();
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const getCourseById = async (id: string): Promise<Course | null> => {
    try {
      const response = await fetch(`/api/cursos/${id}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (err) {
      console.error('Error al obtener curso por ID:', err);
      return null;
    }
  };

  const getCoursesByClass = (classId: string): Course[] => {
    return courses.filter(course => course.id_clase === classId);
  };

  const getCoursesByInstructor = (instructorId: string): Course[] => {
    return courses.filter(course => course.id_instructor === instructorId);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCoursesByClass,
    getCoursesByInstructor,
  };
};
