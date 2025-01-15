export interface CentroCostoResponseType {
    id: number;
    codigo: string;
    nombre: string;
    activo: boolean;
    createdAt: string;
    empresa_id: number;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface CentroCostoRequestType {
    codigo: string;
    nombre: string;
    activo: boolean;
    empresa_id: number;
}