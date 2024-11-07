import { useQuery } from "react-query";
import http from "../http"
import { DatCentro } from "./asientos-types";


const getDatCentro = async () => {
     const response = await http.get(`dat-centro`)
     return response.data;
}

export const useAccounts = () => {
     return useQuery<DatCentro[]>({
          queryKey: ['dat-centro'],
          queryFn: getDatCentro,
          onError: (error) => {
               console.error('Error al obtener las cuentas:', error);
          }
     });
};