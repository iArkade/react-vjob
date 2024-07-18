import { useMutation } from "react-query";
import http from "./http";
import { UsersType, LoginRequestType } from "./user.types";

const createUserRequest = (user: UsersType) =>
     http.post('users', user);

const loginUserRequest = (credentials: LoginRequestType) =>
     http.post('users/login', credentials);

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

