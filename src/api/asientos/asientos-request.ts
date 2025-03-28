import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Asiento } from "./asientos-types";
import { AxiosError } from "axios";

// Función mejorada para obtener mensajes de error
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Error de Axios (respuesta del backend)
    return error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    // Error estándar
    return error.message;
  }
  // Error desconocido
  return "Algo salió mal";
}

// Obtener todos los asientos
const getAsientos = async (empresa_id: number) => {
  try {
    const response = await http.get(`asientos?empresa_id=${empresa_id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const useAsientos = (empresa_id: number) => {
  return useQuery<Asiento[]>({
    queryKey: ["asientos", empresa_id],
    queryFn: () => getAsientos(empresa_id),
    onError: (error) => {
      console.error(getErrorMessage(error));
    },
    refetchOnWindowFocus: true,
    refetchOnMount: false,
  });
};

// Obtener un asiento por ID
const getAsiento = async (id: number, empresa_id: number) => {
  try {
    const response = await http.get(`asientos/${id}?empresa_id=${empresa_id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const useAsiento = (id: number, empresa_id: number) => {
  return useQuery<Asiento>({
    queryKey: ["asiento", id, empresa_id], // Incluir el ID en la queryKey
    queryFn: () => getAsiento(id, empresa_id),
    onError: (error) => {
      console.error(getErrorMessage(error)); // Muestra el mensaje de error específico
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
  });
};

// Crear un asiento
const createAsiento = async (data: Asiento) => {
  try {
    const response = await http.post("/asientos", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const useCreateAsiento = (
  empresa_id: number,
  onSuccessF: () => void,
  onErrorF: (error: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(createAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos", empresa_id], { refetchActive: true });
      onSuccessF();
      console.log("Asiento creado exitosamente");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      onErrorF(errorMessage);
    },
  });
};

// Actualizar un asiento
const updateAsiento = async ({ id, data, empresa_id }: { id: number; data: Asiento; empresa_id: number }) => {
  try {
    const response = await http.put(`/asientos/${id}?empresa_id=${empresa_id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const useUpdateAsiento = (
  onSuccessF: () => void,
  onErrorF: (error: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(updateAsiento, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["asientos", variables.empresa_id], { refetchActive: true });
      onSuccessF();
      console.log("Asiento actualizado exitosamente");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      onErrorF(errorMessage);
    },
  });
};

// Eliminar un asiento
type DeleteAsientoVars = {
  id: number;
  empresa_id: number;
};

const deleteAsiento = async ({ id, empresa_id }: DeleteAsientoVars) => {
  try {
    const response = await http.delete(`asientos/${id}`, { params: { empresa_id } });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const useDeleteAsiento = (
  empresa_id: number,
  onSuccessF: () => void,
  onErrorF: (error: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(deleteAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos", empresa_id], { refetchActive: true });
      onSuccessF();
      console.log("Asiento eliminado exitosamente");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      onErrorF(errorMessage);
    },
  });
};