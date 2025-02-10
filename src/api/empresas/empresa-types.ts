export interface EmpresaResponseType {
    id: number;
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo: string; // Note: logo is a string (URL/path) in response
}

export interface EmpresaRequestType {
    id?: number;
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo?: File | null;
}
