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
  return typeof error === "object" && error !== null && "response" in error;
};

const handleError = (error: unknown): never => {
  if (isApiError(error) && error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw error;
};

// Función para obtener el token JWT del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Asegúrate de que el token se almacene en el localStorage al iniciar sesión
};

// Crear una empresa
const createEmpresaRequest = async (formData: FormData) => {
  try {
    const token = getAuthToken();
    const response = await http.post("empresa", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
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
    mutationKey: ["CreateEmpresa"],
    mutationFn: createEmpresaRequest,
    onSuccess: () => {
      queryClient.invalidateQueries("GetEmpresa"); // Invalidar la caché de empresas
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });
};

// Obtener todas las empresas del usuario autenticado
const getEmpresaRequest = async (): Promise<EmpresaResponseType[]> => {
  try {
    const token = getAuthToken();
    const response = await http.get(`empresa/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const useGetEmpresa = () =>
  useQuery({
    queryKey: ["GetEmpresa"],
    queryFn: () => getEmpresaRequest(),
  });

// Actualizar una empresa
const updateEmpresaRequest = async (id: number, data: EmpresaRequestType) => {
  try {
    const token = getAuthToken();
    const response = await http.put(`empresa/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["UpdateEmpresa"],
    mutationFn: ({ id, data }: { id: number; data: EmpresaRequestType }) =>
      updateEmpresaRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("GetEmpresa"); // Invalidar la caché de empresas
    },
  });
};

// Eliminar una empresa
const deleteEmpresaRequest = async (id: number) => {
  try {
    const token = getAuthToken();
    const response = await http.delete(`empresa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const useDeleteEmpresa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["DeleteEmpresa"],
    mutationFn: (id: number) => deleteEmpresaRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries("GetEmpresa"); // Invalidar la caché de empresas
    },
  });
};