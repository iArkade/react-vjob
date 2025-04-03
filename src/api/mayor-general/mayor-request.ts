// src/api/mayor-general/mayor-general.request.ts
import { useQuery } from 'react-query';
import http from "../http";
import { MayorGeneralResponseType } from './mayor-types';

const getMayorGeneralRequest = async (
     empresaId: number,
     startDate?: string,
     endDate?: string,
     initialAccount?: string,
     finalAccount?: string,
     transaction?: string,
): Promise<MayorGeneralResponseType> => {
     try {
          let url = `reportes/mayor-general/${empresaId}`;
          const params = new URLSearchParams();

          if (startDate) params.append('startDate', startDate);
          if (endDate) params.append('endDate', endDate);
          if (initialAccount) params.append('initialAccount', initialAccount);
          if (finalAccount) params.append('finalAccount', finalAccount);
          if (transaction) params.append('transaction', transaction);

          const queryString = params.toString();
          if (queryString) url += `?${queryString}`;

          const response = await http.get(url);
          return {
               report: response.data,
               startDate,
               endDate,
               initialAccount,
               finalAccount,
               transaction,
          };
     } catch (error) {
          throw new Error('Error al obtener el reporte de mayor general.');
     }
};

export const useGetMayorGeneral = (
     empresaId: number,
     startDate?: string,
     endDate?: string,
     initialAccount?: string,
     finalAccount?: string,
     transaction?: string,
) =>
     useQuery({
          queryKey: ['GetMayorGeneral', empresaId, startDate, endDate, initialAccount, finalAccount, transaction],
          queryFn: () =>
               getMayorGeneralRequest(
                    empresaId,
                    startDate,
                    endDate,
                    initialAccount,
                    finalAccount,
                    transaction
               ),
          staleTime: 0,
          refetchOnWindowFocus: false,
          enabled: false,
     });