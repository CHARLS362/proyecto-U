import { useState, useEffect } from 'react';
import { PREDEFINED_CLASSES, type Class } from '@/lib/classConfig';

export { type Class } from '@/lib/classConfig';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Usar clases predefinidas
      setClasses(PREDEFINED_CLASSES);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (classData: { nombre: string; seccion: string; cuota: number }) => {
    try {
      // Simular creación de clase (solo en memoria)
      const newClass: Class = {
        id: `CLASE${Date.now()}`,
        nombre: classData.nombre,
        seccion: classData.seccion,
        cuota: classData.cuota,
        displayName: `${classData.nombre} - ${classData.seccion}`
      };
      
      setClasses(prev => [...prev, newClass]);
      return { mensaje: 'Clase creada exitosamente', id: newClass.id };
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    error,
    fetchClasses,
    createClass,
  };
}; 