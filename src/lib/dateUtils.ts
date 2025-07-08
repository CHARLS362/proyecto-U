/**
 * Utilidades para el manejo de fechas en la aplicación
 */

/**
 * Formatea una fecha para el input de tipo date (YYYY-MM-DD)
 * @param dateValue - La fecha a formatear (puede ser string, Date, o null/undefined)
 * @returns String en formato YYYY-MM-DD o string vacío si no es válida
 */
export function formatDateForInput(dateValue: any): string {
  if (!dateValue) return '';
  
  try {
    // Si ya está en formato YYYY-MM-DD, devolverlo directamente
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    // Si es un string con formato DD/MM/YYYY
    if (typeof dateValue === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    
    // Intentar parseo general
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // Si no se puede parsear, devolver el valor original
    return String(dateValue);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateValue);
  }
}

/**
 * Formatea una fecha para mostrar en la interfaz (DD/MM/YYYY)
 * @param dateValue - La fecha a formatear
 * @returns String en formato DD/MM/YYYY
 */
export function formatDateForDisplay(dateValue: any): string {
  if (!dateValue) return '';
  
  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return String(dateValue);
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return String(dateValue);
  }
}

/**
 * Valida si una fecha es válida
 * @param dateValue - La fecha a validar
 * @returns true si la fecha es válida, false en caso contrario
 */
export function isValidDate(dateValue: any): boolean {
  if (!dateValue) return false;
  
  try {
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
} 