export interface EmpresaResponseType {
    id: number;
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo: string;
    createdAt: string;
    // Añade aquí cualquier otro campo que pueda devolver tu API
}

export interface EmpresaRequestType {
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo?: string;
}
