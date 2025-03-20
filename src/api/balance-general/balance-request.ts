import { useQuery } from "react-query";
import http from "../http";
import { BalanceGeneralResponseType } from "./balance-types";


const getBalanceGeneralRequest = async (
    empresaId: number,
    endDate?: string,
    level?: number
): Promise<BalanceGeneralResponseType> => {
    try {
        let url = `reportes/balance-general/${empresaId}`;

        // Build query parameters
        const params = new URLSearchParams();
        if (endDate) params.append('endDate', endDate);
        if (level !== undefined && level !== null) params.append('level', level.toString());

        // Append query parameters to URL if they exist
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        const response = await http.get(url);
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener el reporte de pérdidas y ganancias.");
    }
};

export const useGetBalanceGeneral = (
    empresaId: number,
    endDate?: string,
    level?: number
) => useQuery({
    queryKey: ['GetBalanceGeneral', empresaId, endDate, level],
    queryFn: () => getBalanceGeneralRequest(empresaId, endDate, level),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: false
});