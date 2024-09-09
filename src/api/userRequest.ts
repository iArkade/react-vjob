import { useMutation } from "react-query";
import http from "./http";
import { UsersType, LoginRequestType } from "./user.types";

const createUserRequest = (user: UsersType) =>
     http.post('auth/register', user);

export const useCreateUser = () =>
     useMutation({
          mutationKey: ['CreateUser'],
          mutationFn: createUserRequest,
     });


const loginUserRequest = (credentials: LoginRequestType) =>
     http.post('auth/login', credentials);

export const useLoginUser = () =>
     useMutation({
          mutationKey: ['LoginUser'],
          mutationFn: loginUserRequest,
     });

