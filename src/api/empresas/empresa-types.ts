export interface EmpresaResponseType {
    id: number;
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo: string;
    createdAt?: string; // Opcional, dependiendo de tu caso
}

export interface EmpresaConRolType extends EmpresaResponseType {
    companyRole: string; // Agregar el rol del usuario en la empresa
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
