import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { AccountingPlanRequestType, AccountingPlanResponseType } from "./account-types";

interface ApiError {
    response?: {
        data?: {
            message?: string;
            errors?: string[]; // Agrega la propiedad errors
        };
    };
}


const isApiError = (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && 'response' in error;
};

const handleError = (error: unknown): never => {
    if (isApiError(error)) {
        const apiError = error.response?.data;
        if (apiError?.errors) {
            // Lanzamos los errores directamente como un array
            throw new Error(JSON.stringify(apiError.errors)); // Mantén la estructura para manejarla como lista
        }
        if (apiError?.message) {
            throw new Error(apiError.message);
        }
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

const getAccountingPlanPaginatedRequest = async (page: number, limit: number, refreshTrigger?: number): Promise<{ data: AccountingPlanResponseType[], total: number }> => {
    try {
        const response = await http.get(`accounting-plan/paginated?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetAccountingPlanPaginated = (page: number, limit: number, refreshTrigger?: number) =>
    useQuery({
        queryKey: ['GetAccountingPlan', page, limit, refreshTrigger],
        queryFn: () => getAccountingPlanPaginatedRequest(page, limit),
        keepPreviousData: true,
        staleTime: 0, // Ensure fresh data
        refetchOnWindowFocus: false
    });

const getAccountingPlanRequest = async (): Promise<AccountingPlanResponseType[]> => {
    try {
        const response = await http.get(`accounting-plan/all`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetAccountingPlan = () =>
    useQuery({
        queryKey: ['GetAccountingPlan'],
        queryFn: () => getAccountingPlanRequest(),
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

const uploadExcelRequest = async (formData: FormData) => {
    try {
        const response = await http.post('accounting-plan/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUploadExcel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UploadExcel'],
        mutationFn: uploadExcelRequest,
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan'); // Invalidate relevant queries
        },
    });
};