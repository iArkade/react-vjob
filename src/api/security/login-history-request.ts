import { useMutation, useQuery } from "react-query";
import http from "../http";
import { CreateLoginHistoryDto } from "./login-history-types";

const saveLoginHistory = async (data: CreateLoginHistoryDto) => {
     const response = await http.post('/login-history', data);
     return response.data;
};

export const useSaveLoginHistory = () => {
     return useMutation(saveLoginHistory);
};

const getLoginHistory = async (page: number, limit: number = 10) => {
     const safePage = Math.max(0, page);
     const offset = safePage * limit;

     const response = await http.get('/login-history', {
          params: { offset, limit },
     });
     return response.data;
};

export const useLoginHistory = (page: number, limit: number) => {
     return useQuery(['login-history', page, limit], () =>
          getLoginHistory(page, limit),
     );
};

