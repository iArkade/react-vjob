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
