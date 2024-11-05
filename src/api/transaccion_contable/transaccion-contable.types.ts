export interface TransaccionContableResponseType {
    id: number;
    codigo_empresa: string;
    codigo_transaccion: string;
    nombre: string;
    secuencial: number;
    lectura: number;
    activo: boolean;
    createdAt: string;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface TransaccionContableRequestType {
    codigo_empresa?: string;
    codigo_transaccion: string;
    nombre: string;
    secuencial: number;
    lectura: number;
    activo: boolean;
}