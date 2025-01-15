import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { Asiento } from "./asientos-types";

const getAsientos = async (empresa_id: number) => {
  const response = await http.get(`asientos?empresa_id=${empresa_id}`);
  return response.data;
};

export const useAsientos = (empresa_id: number) => {
  const queryClient = useQueryClient();
  return useQuery<Asiento[]>({
    queryKey: ["asientos", empresa_id],
    queryFn: () => getAsientos(empresa_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["asiento"]);
    },
    onError: (error) => {
      console.error("Error al obtener los asientos:", error);
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

const getAsiento = async (id: number, empresa_id: number) => {
  const response = await http.get(`asientos/${id}?empresa_id=${empresa_id}`);
  return response.data;
};

export const useAsiento = (id: number, empresa_id: number) => {
  return useQuery<Asiento>({
    queryKey: ["asiento", empresa_id],
    queryFn: () => getAsiento(id, empresa_id),
    onError: (error) => {
      console.error("Error al obtener los asientos:", error);
    },
    // This helps to refresh the page when fetching the data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale
    cacheTime: 0,
  }); 
};

const createAsiento = async (data: Asiento) => {
  //console.log(data)
  const response = await http.post("/asientos", data);
  return response.data;
};

export const useCreateAsiento = () => {
  const queryClient = useQueryClient();

  return useMutation(createAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);

      console.log("Asiento creado exitosamente");
    },
    onError: (error) => {
      console.error("Error al crear el asiento:", error);
    },
  });
};

const updateAsiento = async ({ id, data, empresa_id }: { id: number; data: Asiento; empresa_id: number }) => {
  const response = await http.put(`/asientos/${id}?empresa_id=${empresa_id}`, data);
  return response.data;
};

export const useUpdateAsiento = (
  onSuccessF: () => void,
  onErrorF: (error: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation(updateAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);
      onSuccessF();

      console.log("Asiento actualizado exitosamente");
    },
    onError: (error) => {
      onErrorF(error);
    },
  });
};

const deleteAsiento = async (id: number) => {
  const response = await http.delete(`asientos/${id}`);
  return response.data;
};

export const useDeleteAsiento = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteAsiento, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asientos"]);
      console.log("Asiento eliminado exitosamente");
    },
    onError: (error) => {
      console.error("Error al eliminar el asiento:", error);
    },
  });
};
