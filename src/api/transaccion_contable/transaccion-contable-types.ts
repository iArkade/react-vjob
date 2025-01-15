export interface TransaccionContableResponseType {
    id: number;
    codigo_transaccion: string;
    nombre: string;
    secuencial: string;
    lectura: number;
    activo: boolean;
    createdAt: string;
    empresa_id: number;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface TransaccionContableRequestType {
    codigo_transaccion: string;
    nombre: string;
    secuencial: string;
    lectura: number;
    activo: boolean;
    empresa_id: number;
}