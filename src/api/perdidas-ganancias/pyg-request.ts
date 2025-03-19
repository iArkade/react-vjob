import { useQuery } from "react-query";
import http from "../http";
import { ProfitLossResponseType } from "./pyg-types";


const getProfitLossRequest = async (
    empresaId: number,
    startDate?: string,
    endDate?: string,
    level?: number
): Promise<ProfitLossResponseType> => {
    try {
        let url = `reportes/perdidas-ganancias/${empresaId}`;

        // Build query parameters
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
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

export const useGetProfitLoss = (
    empresaId: number,
    startDate?: string,
    endDate?: string,
    level?: number
) => useQuery({
    queryKey: ['GetProfitLoss', empresaId, startDate, endDate, level],
    queryFn: () => getProfitLossRequest(empresaId, startDate, endDate, level),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: false
});