import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { AccountingPlanRequestType, AccountingPlanResponseType } from "./account.types";

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const isApiError = (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && 'response' in error;
};

const handleError = (error: unknown): never => {
    if (isApiError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
    }
    throw error;
};

const createAccountingPlanRequest = async (data: AccountingPlanRequestType) => {
    try {
        const response = await http.post('accounting-plan', { code: data.code, name: data.name });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useCreateAccountingPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['CreateAccountingPlan'],
        mutationFn: createAccountingPlanRequest,
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan');
        },
    });
};

const getAccountingPlanRequest = async (page: number, limit: number): Promise<{ data: AccountingPlanResponseType[], total: number }> => {
    try {
        const response = await http.get(`accounting-plan?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetAccountingPlan = (page: number, limit: number) =>
    useQuery({
        queryKey: ['GetAccountingPlan', page, limit],
        queryFn: () => getAccountingPlanRequest(page, limit),
        keepPreviousData: true,
    });

const updateAccountingPlanRequest = async (id: number, data: AccountingPlanRequestType) => {
    try {
        const response = await http.put(`accounting-plan/${id}`, { code: data.code, name: data.name });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUpdateAccountingPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateAccountingPlan'],
        mutationFn: ({ id, data }: { id: number, data: AccountingPlanRequestType }) => updateAccountingPlanRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan');
        },
    });
};

const deleteAccountingPlanRequest = async (code: string) => {
    try {
        const response = await http.delete(`accounting-plan/${code}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useDeleteAccountingPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['DeleteAccountingPlan'],
        mutationFn: (code: string) => deleteAccountingPlanRequest(code),
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan');
        },
    });
};