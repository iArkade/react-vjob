export interface UsersType {
     email: string;
     name: string;
     lastname: string;
     password: string;
     active?: boolean;
     role?: string;
}

export interface UsuarioResponseType {
     id: number;
     email: string;
     name: string;
     lastname?: string;
     active?: boolean;
     role: string;
}

export interface UsuarioRequestType {
     id?: number;
     email: string;
     name: string;
     lastname?: string;
     role: string;
}

export interface LoginRequestType {
     email: string;
     password: string;
}