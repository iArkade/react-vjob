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
        const response = await http.post('dat-centro', { codigo: data.codigo, nombre: data.nombre, activo: data.activo });
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

const getCentroCostoPaginatedRequest = async (page: number, limit: number): Promise<{ data: CentroCostoResponseType[], total: number }> => {
    try {
        const response = await http.get(`dat-centro/paginated?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetCentroCostoPaginated = (page: number, limit: number) =>
    useQuery({
        queryKey: ['GetCentroCosto', page, limit],
        queryFn: () => getCentroCostoPaginatedRequest(page, limit),
        keepPreviousData: true,
    });


const getCentroCostoRequest = async (): Promise<CentroCostoResponseType[]> => {
    try {
        const response = await http.get(`dat-centro/all`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetCentroCosto = () =>
    useQuery({
        queryKey: ['GetCentroCosto'],
        queryFn: () => getCentroCostoRequest(),
    });


const updateCentroCostoRequest = async (id: number, data: CentroCostoRequestType) => {
    try {
        const response = await http.put(`dat-centro/${id}`, { codigo: data.codigo, nombre: data.nombre, activo: data.activo });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUpdateCentroCosto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateCentroCosto'],
        mutationFn: ({ id, data }: { id: number, data: CentroCostoRequestType }) => updateCentroCostoRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries('GetCentroCosto');
        },
    });
};

const deleteCentroCostoRequest = async (code: string) => {
    try {
        const response = await http.delete(`dat-centro/${code}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useDeleteCentroCosto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['DeleteCentroCosto'],
        mutationFn: (code: string) => deleteCentroCostoRequest(code),
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