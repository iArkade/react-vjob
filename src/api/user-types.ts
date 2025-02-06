export interface UsersType {
     email: string;
     name: string;
     lastname: string;
     password: string;
     active?: boolean;
     role?: string;
}

export interface LoginRequestType {
     email: string;
     password: string;
}