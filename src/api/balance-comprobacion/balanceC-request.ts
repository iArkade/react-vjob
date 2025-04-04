import { useQuery } from 'react-query';
import http from "../http";
import { BalanceComprobacionResponseType } from './balanceC-types';

const getBalanceComprobacionRequest = async (
    empresaId: number,
    startDate?: string,
    endDate?: string,
    initialAccount?: string,
    finalAccount?: string,
    level?: number,
): Promise<BalanceComprobacionResponseType> => {
    try {
        let url = `reportes/balance-comprobacion/${empresaId}`;
        const params = new URLSearchParams();

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (initialAccount) params.append('initialAccount', initialAccount);
        if (finalAccount) params.append('finalAccount', finalAccount);
        if (level !== undefined && level !== null) params.append('level', level.toString());

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const response = await http.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el reporte de balance de comprobación.');
    }
};

export const useGetBalanceComprobacion = (
    empresaId: number,
    startDate?: string,
    endDate?: string,
    initialAccount?: string,
    finalAccount?: string,
    level?: number,
) =>
    useQuery({
        queryKey: ['GetBalanceComprobacion', empresaId, startDate, endDate, initialAccount, finalAccount, level],
        queryFn: () =>
            getBalanceComprobacionRequest(
                empresaId,
                startDate,
                endDate,
                initialAccount,
                finalAccount,
                level
            ),
        staleTime: 0,
        refetchOnWindowFocus: false,
        enabled: false,
    });