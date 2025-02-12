export interface UsersType {
     email: string;
     name: string;
     lastname?: string;
     password: string;
     password2?: string;
     active?: boolean;
     systemRole?: string;
}

export interface UsuarioResponseType {
     id: number;
     email: string;
     name: string;
     lastname?: string;
     active?: boolean;
     systemRole: string;
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

export interface UsuarioRequestType {
     id?: number;
     email: string;
     name: string;
     lastname?: string;
     password: string;
     systemRole: string;
     empresas: {
          empresaId: number;    // ID de la empresa asignada
          companyRole: string;  // Rol de la empresa asignada
     }[];  // Aquí cambiamos a un arreglo de objetos de empresas
}

export enum SystemRole {
     ADMIN = 'admin',
     USER = 'user'
}

export enum CompanyRole {
     ADMIN = 'admin',
     USER = 'user'
}

export interface LoginRequestType {
     email: string;
     password: string;
}
