import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { CentroCostoResponseType, CentroCostoRequestType } from "./centro-costo.types";

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

const createCentroCostoRequest = async (data: CentroCostoRequestType) => {
    try {
        const response = await http.post('dat-centro', { codigo: data.codigo, nombre: data.nombre, activo: data.activo, empresa_id: data.empresa_id });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useCreateCentroCosto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['CreateCentroCosto'],
        mutationFn: createCentroCostoRequest,
        onSuccess: () => {
            queryClient.invalidateQueries('GetCentroCosto');
        },
    });
};

const getCentroCostoPaginatedRequest = async (page: number, limit: number, empresa_id: number): Promise<{ data: CentroCostoResponseType[], total: number }> => {
    try {
        const response = await http.get(`dat-centro/paginated?page=${page}&limit=${limit}&empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetCentroCostoPaginated = (page: number, limit: number, empresa_id: number) =>
    useQuery({
        queryKey: ['GetCentroCosto', page, limit, empresa_id],
        queryFn: () => getCentroCostoPaginatedRequest(page, limit, empresa_id),
        keepPreviousData: true,
    });


const getCentroCostoRequest = async (empresa_id: number): Promise<CentroCostoResponseType[]> => {
    try {
        const response = await http.get(`dat-centro/all?empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetCentroCosto = (empresa_id: number) =>
    useQuery({
        queryKey: ['GetCentroCosto', empresa_id],
        queryFn: () => getCentroCostoRequest(empresa_id),
        refetchOnWindowFocus: false,      
        refetchOnMount: false,            
        staleTime: 1000 * 60 * 5, 
    });


const updateCentroCostoRequest = async (id: number, data: CentroCostoRequestType, empresa_id: number) => {
    try {
        const response = await http.put(`dat-centro/${id}?empresa_id=${empresa_id}`, { codigo: data.codigo, nombre: data.nombre, activo: data.activo });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUpdateCentroCosto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateCentroCosto'],
        mutationFn: ({ id, data, empresa_id }: { id: number, data: CentroCostoRequestType, empresa_id: number }) => updateCentroCostoRequest(id, data, empresa_id),
        onSuccess: (_, { empresa_id }) => {
            queryClient.invalidateQueries(['GetCentroCosto', empresa_id]);
        },
    });
};

const deleteCentroCostoRequest = async (code: string, empresa_id: number) => {
    try {
        const response = await http.delete(`dat-centro/${code}?empresa_id=${empresa_id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useDeleteCentroCosto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['DeleteCentroCosto'],
        mutationFn: ({ code, empresa_id }: { code: string; empresa_id: number }) => deleteCentroCostoRequest(code, empresa_id),
        onSuccess: () => {
            queryClient.invalidateQueries('GetCentroCosto');
        },
    });
};

const uploadExcelRequest = async (formData: FormData) => {
    try {
        const response = await http.post('dat-centro/upload', formData, {
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
            queryClient.invalidateQueries('GetCentroCosto'); // Invalidate relevant queries
        },
    });
};