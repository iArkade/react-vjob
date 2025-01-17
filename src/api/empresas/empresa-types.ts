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
    // Agregar otro campo que pueda devolver la API
}

export interface EmpresaRequestType {
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo?: File | null;
}
