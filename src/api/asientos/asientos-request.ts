import { useMutation, useQuery } from "react-query";
import http from "../http"
import { DatCentro } from "./asientos-types";


const getDatCentro = async () => {
     const response = await http.get(`dat-centro`)
     return response.data;
}

const createAsiento = async (data: any) => {
     //console.log(data)
     const response = await http.post('/asientos', data);
     return response.data;
};


export const useAccounts = () => {
     return useQuery<DatCentro[]>({
          queryKey: ['dat-centro'],
          queryFn: getDatCentro,
          onError: (error) => {
               console.error('Error al obtener las cuentas:', error);
          }
     });
};

export const useCreateAsiento = () => {
     return useMutation(createAsiento, {
          onSuccess: () => {
               console.log('Asiento creado exitosamente');
          },
          onError: (error) => {
               console.error('Error al crear el asiento:', error);
          },
     });
};