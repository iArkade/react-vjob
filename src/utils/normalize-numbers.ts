export const normalizeNumericValue = (value: string): string => {
     // Si está vacío, devolver 0
     if (value.trim() === '') return '0';

     // Reemplazar comas por puntos
     const normalized = value.replace(',', '.');

     // Eliminar cualquier carácter que no sea número o punto
     const cleaned = normalized.replace(/[^0-9.]/g, '');

     // Manejar múltiples puntos decimales
     const parts = cleaned.split('.');
     if (parts.length > 2) {
          return `${parts[0]}.${parts.slice(1).join('')}`;
     }

     // Eliminar ceros a la izquierda, excepto si es un decimal
     if (parts[0].startsWith('0') && parts[0].length > 1 && !parts[0].startsWith('0.')) {
          parts[0] = parts[0].replace(/^0+/, '');
     }

     return cleaned || '0';
};