/**
 * Genera un identificador único: [Letra][10 dígitos aleatorios]
 * Ejemplo: A9876543210, T1718791191, S1718791292, O7898987845
 */
export function generateUniqueId(type: 'T' | 'S' | 'O' | 'A' = 'T'): string {
  // Generar 10 dígitos aleatorios
  let digits = '';
  for (let i = 0; i < 10; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return `${type}${digits}`;
}

/**
 * Valida si un identificador tiene el formato correcto
 * Debe tener exactamente 11 caracteres: [Letra][10 dígitos]
 */
export function validateIdFormat(identifier: string): boolean {
  if (identifier.length !== 11) return false;
  const validTypes = ['T', 'S', 'O', 'A'];
  if (!validTypes.includes(identifier[0])) return false;
  const digits = identifier.slice(1);
  return /^\d{10}$/.test(digits);
}

/**
 * Extrae el tipo de usuario del identificador
 */
export function getUserIdType(identifier: string): string {
  if (!validateIdFormat(identifier)) return 'unknown';
  const type = identifier[0];
  switch (type) {
    case 'T': return 'profesor';
    case 'S': return 'estudiante';
    case 'O': return 'propietario';
    case 'A': return 'admin';
    default: return 'unknown';
  }
} 