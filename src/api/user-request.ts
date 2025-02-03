import { useMutation } from "react-query";
import http from "./http";
import { UsersType, LoginRequestType } from "./user-types";

const createUserRequest = (user: UsersType) =>
     http.post('auth/register', user);

const loginUserRequest = (credentials: LoginRequestType) =>
     http.post('auth/login', credentials);

const logoutUserRequest = () => {
     const token = localStorage.getItem('token');

     return http.post(
          '/auth/logout',
          {}, // No es necesario enviar un cuerpo, solo los headers
          {
               headers: {
                    'Authorization': `Bearer ${token}`,  // Enviar el token en el header 
               },
          },
     );
};

export const useCreateUser = () =>
     useMutation({
          mutationKey: ['CreateUser'],
          mutationFn: createUserRequest,
     });

export const useLoginUser = () =>
     useMutation({
          mutationKey: ['LoginUser'],
          mutationFn: loginUserRequest,
     });

export const useLogoutUser = () =>
     useMutation({
          mutationKey: ['LogoutUser'],
          mutationFn: logoutUserRequest,
     });