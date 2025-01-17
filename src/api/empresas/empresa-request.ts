import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { EmpresaRequestType, EmpresaResponseType } from "./empresa-types";

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

const createEmpresaRequest = async (formData: FormData) => {
    try {
        const response = await http.post('empresa', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error; 
    }
};

export const useCreateEmpresa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['CreateEmpresa'],
        mutationFn: createEmpresaRequest,
        onSuccess: () => {
            queryClient.invalidateQueries('GetEmpresa');
        },
    });
};


const getEmpresaRequest = async (): Promise<EmpresaResponseType[]> => {
    try {
        const response = await http.get(`empresa/all`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const useGetEmpresa = () =>
    useQuery({
        queryKey: ['GetEmpresa'],
        queryFn: () => getEmpresaRequest(),
    });


const updateEmpresaRequest = async (id: number, data: EmpresaRequestType) => {
    try {
        const response = await http.put(`empresa/${id}`, { codigo: data.codigo, ruc: data.ruc, nombre: data.nombre, correo: data.correo, telefono: data.telefono, direccion: data.direccion, logo: data.logo });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useUpdateEmpresa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['UpdateEmpresa'],
        mutationFn: ({ id, data }: { id: number, data: EmpresaRequestType }) => updateEmpresaRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries('GetEmpresa');
        },
    });
};

const deleteEmpresaRequest = async (code: string) => {
    try {
        const response = await http.delete(`empresa/${code}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const useDeleteEmpresa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['DeleteEmpresa'],
        mutationFn: (code: string) => deleteEmpresaRequest(code),
        onSuccess: () => {
            queryClient.invalidateQueries('GetEmpresa');
        },
    });
};



