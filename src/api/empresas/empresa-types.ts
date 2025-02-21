import { UsuarioBaseType } from "../user-types";

// Tipo base para una empresa
export interface EmpresaBaseType {
    id: number;
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo?: string; // Hacerlo opcional para mayor flexibilidad
    createdAt?: string; // Opcional, dependiendo de tu caso
}

// Tipo para la respuesta de una empresa (sin usuarios)
export interface EmpresaResponseType extends EmpresaBaseType {}

// Tipo para una empresa con el rol del usuario
export interface EmpresaConRolType extends EmpresaBaseType {
    companyRole: string; // Rol del usuario en la empresa
}

// Tipo para una empresa con la lista de usuarios asignados
export interface EmpresaConUsuariosType extends EmpresaBaseType {
    usuarios?: UsuarioEmpresaType[]; // Lista de usuarios asignados a la empresa
}

// Tipo para la relación usuario-empresa
export interface UsuarioEmpresaType {
    id: number;
    companyRole: string; // "admin", "user", etc.
    assignedAt: string; // Fecha en formato ISO
    usuario: UsuarioBaseType; // Reutilizar el tipo base de usuario
}

// Tipo para crear o actualizar una empresa
export interface EmpresaRequestType {
    id?: number; // Opcional para actualizaciones
    codigo: string;
    ruc: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    logo?: File | null; // Opcional, dependiendo de tu caso
}