import { useMutation } from "react-query";
import http from "./http";
import { UsersType, LoginRequestType } from "./user-types";

const registerUserRequest = (user: UsersType) =>
     http.post('auth/register', user);

const loginUserRequest = (credentials: LoginRequestType) =>
     http.post('auth/login', credentials);

const logoutUserRequest = () => {
     const token = localStorage.getItem('token');

     return http.post(
          '/auth/logout',
          {},
          {
               headers: {
                    'Authorization': `Bearer ${token}`,  // Enviar el token en el header 
               },
          },
     );
};

export const useRegisterUser = () =>
     useMutation({
          mutationKey: ['RegisterUser'],
          mutationFn: registerUserRequest,
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