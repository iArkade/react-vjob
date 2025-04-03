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
        const response = await http.post('accounting-plan', { code: data.code, name: data.name, empresa_id: data.empresa_id });
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

const getAccountingPlanPaginatedRequest = async (page: number, limit: number, empresa_id: number): Promise<{ data: AccountingPlanResponseType[], total: number }> => {
    try {
        const response = await http.get(`accounting-plan/paginated?page=${page}&limit=${limit}&empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetAccountingPlanPaginated = (
    page: number,
    limit: number,
    empresa_id: number,
    refreshTrigger?: number,
) =>
    useQuery({
        queryKey: ['GetAccountingPlan', page, limit, empresa_id, refreshTrigger],
        queryFn: () => getAccountingPlanPaginatedRequest(page, limit, empresa_id),
        enabled: !!empresa_id,
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

const getAccountingPlanRequest = async (empresa_id: number): Promise<AccountingPlanResponseType[]> => {
    try {
        const response = await http.get(`accounting-plan/all?empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        throw  handleError(error);
    }
};

export const useGetAccountingPlan = (empresa_id: number) =>
    useQuery({
        queryKey: ['GetAccountingPlan', empresa_id],
        queryFn: () => getAccountingPlanRequest(empresa_id),
        staleTime: Infinity, 
        refetchOnWindowFocus: false, 
        refetchOnMount: false, 
        enabled: !!empresa_id,
    });


const updateAccountingPlanRequest = async (id: number, data: AccountingPlanRequestType, empresa_id: number) => {
    try {
        const response = await http.put(
            `accounting-plan/${id}?empresa_id=${empresa_id}`, // Aquí agregamos el empresa_id como query param
            { code: data.code, name: data.name } // Solo enviamos el cuerpo esperado
        );
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const useUpdateAccountingPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateAccountingPlan'],
        mutationFn: ({ id, data, empresa_id }: { id: number, data: AccountingPlanRequestType, empresa_id: number }) =>
            updateAccountingPlanRequest(id, data, empresa_id),
        onSuccess: (_, { empresa_id }) => {
            queryClient.invalidateQueries(['GetAccountingPlan', empresa_id]); // Invalida la consulta con el empresaId
        },
    });
};

const deleteAccountingPlanRequest = async (code: string, empresa_id: number) => {
    try {
        const response = await http.delete(`accounting-plan/${code}?empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


export const useDeleteAccountingPlan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DeleteAccountingPlan'],
        mutationFn: ({ code, empresa_id }: { code: string; empresa_id: number }) =>
            deleteAccountingPlanRequest(code, empresa_id),
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan'); // Invalida la cache para actualizar la tabla
        },
    });
};


const uploadExcelRequest = async (formData: FormData, empresa_id: number) => {
    try {
        const response = await http.post(`accounting-plan/upload?empresa_id=${empresa_id}`, formData, {
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
        mutationFn: ({ formData, empresa_id }: { formData: FormData; empresa_id: number }) =>
            uploadExcelRequest(formData, empresa_id), // Pasa ambos argumentos
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan'); // Refresca los datos relevantes
        },
    });
};

