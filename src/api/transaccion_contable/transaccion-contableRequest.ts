import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { TransaccionContableResponseType, TransaccionContableRequestType } from "./transaccion-contable.types";

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

const createTransaccionContableRequest = async (data: TransaccionContableRequestType) => {
    try {
        const response = await http.post('transaccion-contable', { codigo_transaccion: data.codigo_transaccion, nombre: data.nombre, secuencial: data.secuencial, lectura: data.lectura, activo: data.activo });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useCreateTransaccionContable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['CreateTransaccionContable'],
        mutationFn: createTransaccionContableRequest,
        onSuccess: () => {
            queryClient.invalidateQueries('GetTransaccionContable');
        },
    });
};

const getTransaccionContablePaginatedRequest = async (page: number, limit: number): Promise<{ data: TransaccionContableResponseType[], total: number }> => {
    try {
        const response = await http.get(`transaccion-contable/paginated?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetTransaccionContablePaginated = (page: number, limit: number) =>
    useQuery({
        queryKey: ['GetTransaccionContable', page, limit],
        queryFn: () => getTransaccionContablePaginatedRequest(page, limit),
        keepPreviousData: true,
    });


const getTransaccionContableRequest = async (): Promise<TransaccionContableResponseType[]> => {
    try {
        const response = await http.get(`transaccion-contable/all`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetTransaccionContable = () =>
    useQuery({
        queryKey: ['GetTransaccionContable'],
        queryFn: () => getTransaccionContableRequest(),
        onError: (error) => {
            console.error('Error al obtener las transacciones:', error);
        }
    });


const updateTransaccionContableRequest = async (id: number, data: TransaccionContableRequestType) => {
    try {
        const response = await http.put(`transaccion-contable/${id}`, { codigo_transaccion: data.codigo_transaccion, nombre: data.nombre, secuencial: data.secuencial, lectura: data.lectura, activo: data.activo });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUpdateTransaccionContable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateTransaccionContable'],
        mutationFn: ({ id, data }: { id: number, data: TransaccionContableRequestType }) => updateTransaccionContableRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries('GetTransaccionContable');
        },
    });
};

const deleteTransaccionContableRequest = async (code: string) => {
    try {
        const response = await http.delete(`transaccion-contable/${code}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useDeleteTransaccionContable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['DeleteTransaccionContable'],
        mutationFn: (code: string) => deleteTransaccionContableRequest(code),
        onSuccess: () => {
            queryClient.invalidateQueries('GetTransaccionContable');
        },
    });
};

const uploadExcelRequest = async (formData: FormData) => {
    try {
        const response = await http.post('transaccion-contable/upload', formData, {
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
            queryClient.invalidateQueries('GetTransaccionContable'); // Invalidate relevant queries
        },
    });
};