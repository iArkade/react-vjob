import { useQuery } from "react-query";
import http from "../http";
import { LibroDiarioResponseType } from "./libro-types";



const getLibroDiarioRequest = async (
    empresaId: number,
    fechaDesde?: string,
    fechaHasta?: string,
    codigoTransaccion?: string
): Promise<LibroDiarioResponseType> => {
    try {
        let url = `reportes/libro-diario/${empresaId}`;

        // Build query parameters
        const params = new URLSearchParams();
        if (fechaDesde) params.append('fechaDesde', fechaDesde);
        if (fechaHasta) params.append('fechaHasta', fechaHasta);
        if (codigoTransaccion) params.append('codigoTransaccion', codigoTransaccion);

        // Append query parameters to URL if they exist
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        const response = await http.get(url);
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener el reporte de libro diario.");
    }
};

export const useGetLibroDiario = (
    empresaId: number,
    fechaDesde?: string,
    fechaHasta?: string,
    codigoTransaccion?: string
) => useQuery({
    queryKey: ['GetLibroDiario', empresaId, fechaDesde, fechaHasta, codigoTransaccion],
    queryFn: () => getLibroDiarioRequest(empresaId, fechaDesde, fechaHasta, codigoTransaccion),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: false
});