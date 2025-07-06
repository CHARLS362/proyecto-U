export interface Class {
  id: string;
  nombre: string;
  seccion: string;
  cuota: number;
  displayName: string;
}

// Configuración de clases predefinidas
export const PREDEFINED_CLASSES: Class[] = [
  { id: 'CLASE001', nombre: 'Primer Grado', seccion: 'A', cuota: 150, displayName: 'Primer Grado - A' },
  { id: 'CLASE002', nombre: 'Primer Grado', seccion: 'B', cuota: 150, displayName: 'Primer Grado - B' },
  { id: 'CLASE003', nombre: 'Primer Grado', seccion: 'C', cuota: 150, displayName: 'Primer Grado - C' },
  { id: 'CLASE004', nombre: 'Segundo Grado', seccion: 'A', cuota: 160, displayName: 'Segundo Grado - A' },
  { id: 'CLASE005', nombre: 'Segundo Grado', seccion: 'B', cuota: 160, displayName: 'Segundo Grado - B' },
  { id: 'CLASE006', nombre: 'Tercer Grado', seccion: 'A', cuota: 170, displayName: 'Tercer Grado - A' },
  { id: 'CLASE007', nombre: 'Tercer Grado', seccion: 'B', cuota: 170, displayName: 'Tercer Grado - B' },
  { id: 'CLASE008', nombre: 'Cuarto Grado', seccion: 'A', cuota: 180, displayName: 'Cuarto Grado - A' },
  { id: 'CLASE009', nombre: 'Quinto Grado', seccion: 'A', cuota: 190, displayName: 'Quinto Grado - A' },
  { id: 'CLASE010', nombre: 'Sexto Grado', seccion: 'A', cuota: 200, displayName: 'Sexto Grado - A' },
];

// Función para obtener clases por nombre
export const getClassesByName = (nombre: string): Class[] => {
  return PREDEFINED_CLASSES.filter(clase => clase.nombre === nombre);
};

// Función para obtener todas las clases únicas por nombre
export const getUniqueClassNames = (): string[] => {
  return Array.from(new Set(PREDEFINED_CLASSES.map(clase => clase.nombre)));
};

// Función para obtener una clase específica
export const getClassById = (id: string): Class | undefined => {
  return PREDEFINED_CLASSES.find(clase => clase.id === id);
};

// Función para obtener una clase por nombre y sección
export const getClassByNameAndSection = (nombre: string, seccion: string): Class | undefined => {
  return PREDEFINED_CLASSES.find(clase => clase.nombre === nombre && clase.seccion === seccion);
}; 