export interface CentroCostoResponseType {
    id: number;
    codigo_empresa: string;
    codigo: string;
    nombre: string;
    activo: boolean;
    createdAt: string;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface CentroCostoRequestType {
    codigo_empresa?: string;
    codigo: string;
    nombre: string;
    activo: boolean;
}