// Tipo base para un usuario
export interface UsuarioBaseType {
     id: number;
     email: string;
     name: string;
     lastname?: string;
     password?: string;
     active?: boolean;
     systemRole?: string;
     tokens?: string;
     createdAt?: string;
     createdBy?: { id: number } | null;
}

// Tipo para registrar un superadmin
export interface RegistrarUsuarioType {
     email: string;
     name: string;
     lastname?: string;
     password: string;
     password2?: string;
     active?: boolean;
     systemRole?: string;
}

// Tipo para iniciar sesión
export interface LoginRequestType {
     email: string;
     password: string;
}

// Tipo para la relación usuario-empresa
export interface UsuarioEmpresaType {
     id: number;
     companyRole: string; // "admin", "user", etc.
     assignedAt: string; // Fecha en formato ISO
     usuario: UsuarioBaseType; // Información del usuario
}

// Tipo para la respuesta de un usuario con sus empresas asignadas
export interface UsuarioResponseType extends UsuarioBaseType {
     empresas: {
          id: number;              // ID de la relación usuario-empresa
          companyRole: string;     // Rol de la empresa (si aplica)
          empresa: {               // Información de la empresa
               id: number;          // ID de la empresa
               codigo: string;      // Código de la empresa
               nombre: string;      // Nombre de la empresa
          };
     }[];
}

// Tipo para crear o actualizar un usuario
export interface UsuarioRequestType {
     id?: number;
     email: string;
     name: string;
     lastname?: string;
     password: string;
     systemRole?: string;
     empresas: {
          empresaId: number;    // ID de la empresa asignada
          companyRole: string;  // Rol de la empresa asignada
     }[];
}

// Enumeración para los roles de empresa
export enum CompanyRole {
     ADMIN = 'admin',
     USER = 'user'
}

// Tipo para la relación usuario-empresa en el usuario autenticado
export interface AuthUserEmpresa {
     id: number;
     nombre: string;
     role: string;
}

// Tipo para el usuario autenticado
export interface AuthUserType extends UsuarioBaseType {
     empresas: AuthUserEmpresa[];
}