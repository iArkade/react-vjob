import { useMutation, useQuery } from "react-query";
import http from "../http"
import { DatCentro } from "./asientos-types";
import { toast } from "sonner";


const getDatCentro = async () => {
     const response = await http.get(`dat-centro`)
     return response.data;
}

const postAsiento = async (data: Values) => {
     const { lineItems, ...asientoData } = data;

     // Enviar datos a la tabla `asiento`
     const asientoResponse = await http.post('/asiento', asientoData);
     const asientoId = asientoResponse.data.id;

     // Enviar cada `lineItem` con la relación al ID de `asiento`
     const asientoItemsRequests = lineItems.map((item) => ({
          ...item,
          asientoId,
     }));
     await http.post('/asiento-items', asientoItemsRequests);

     return asientoResponse.data;
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
     return useMutation({
          mutationKey: ['create-asiento'],
          mutationFn: postAsiento,
          onSuccess: (data) => {
               toast.success('Asiento creado con éxito');
               console.log('Respuesta de la API:', data);
          },
          onError: (error) => {
               toast.error('Error al crear el asiento');
               console.error('Error:', error);
          },
     });
};