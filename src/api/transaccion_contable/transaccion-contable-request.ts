import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { TransaccionContableResponseType, TransaccionContableRequestType } from "./transaccion-contable-types";

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
        const response = await http.post('transaccion-contable', { codigo_transaccion: data.codigo_transaccion, nombre: data.nombre, secuencial: data.secuencial, lectura: data.lectura, activo: data.activo, empresa_id: data.empresa_id });
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

const getTransaccionContablePaginatedRequest = async (page: number, limit: number, empresa_id: number): Promise<{ data: TransaccionContableResponseType[], total: number }> => {
    try {
        const response = await http.get(`transaccion-contable/paginated?page=${page}&limit=${limit}&empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetTransaccionContablePaginated = (page: number, limit: number, empresa_id: number) =>
    useQuery({
        queryKey: ['GetTransaccionContable', page, limit, empresa_id],
        queryFn: () => getTransaccionContablePaginatedRequest(page, limit, empresa_id),
        keepPreviousData: true,
    });


const getTransaccionContableRequest = async (empresa_id: number): Promise<TransaccionContableResponseType[]> => {
    try {
        const response = await http.get(`transaccion-contable/all?empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    } 
};

export const useGetTransaccionContable = (empresa_id: number) =>
    useQuery({
        queryKey: ['GetTransaccionContable', empresa_id],
        queryFn: () => getTransaccionContableRequest(empresa_id),
        refetchOnWindowFocus: false,    // Evita recarga al cambiar de pestaña
        staleTime: 30 * 60 * 1000,      // 30 min antes de considerar los datos obsoletos
        cacheTime: 60 * 60 * 1000,      // 1 hora en cache
        enabled: !!empresa_id,          // Solo se ejecuta si hay un `empresa_id` válido
        onError: (error) => {
            console.error('Error al obtener las transacciones:', error);
        },
    });


const updateTransaccionContableRequest = async (id: number, data: TransaccionContableRequestType, empresa_id: number) => {
    try {
        const response = await http.put(`transaccion-contable/${id}?empresa_id=${empresa_id}`, { codigo_transaccion: data.codigo_transaccion, nombre: data.nombre, secuencial: data.secuencial, lectura: data.lectura, activo: data.activo });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUpdateTransaccionContable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateTransaccionContable'],
        mutationFn: ({ id, data, empresa_id }: { id: number, data: TransaccionContableRequestType, empresa_id: number }) => updateTransaccionContableRequest(id, data, empresa_id),
        onSuccess: (_, { empresa_id }) => {
            queryClient.invalidateQueries(['GetTransaccionContable', empresa_id]); // Invalida la consulta con el empresaId
        },
    });
};

const deleteTransaccionContableRequest = async (code: string, empresa_id: number) => {
    try {
        const response = await http.delete(`transaccion-contable/${code}?empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useDeleteTransaccionContable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['DeleteTransaccionContable'],
        mutationFn: ({ code, empresa_id }: { code: string; empresa_id: number }) => deleteTransaccionContableRequest(code, empresa_id),
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