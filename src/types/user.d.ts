export interface User {
     id: string;
     email: string;
     name?: string;
     lastname?: string;
     role: string;
     password: string;
     active: boolean;
     tokens: string;

     [key: string]: unknown;
}

export interface UserProfile{
     id?: string;
     name?: string;
     lastname?: string;
     avatar?: string;
     email?: string;
     role: string;
}