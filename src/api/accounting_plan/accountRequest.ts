import { useMutation, useQuery } from "react-query";
import http from "../http";
import { AccountingPlanRequestType, AccountingPlanResponseType } from "./account.types";

// Solicitud para crear un plan de cuentas
const createAccountingPlanRequest = (data: AccountingPlanRequestType) =>
    http.post('accounting-plan', { code: data.code, name: data.name });

export const useCreateAccountingPlan = () =>
    useMutation({
        mutationKey: ['CreateAccountingPlan'],
        mutationFn: createAccountingPlanRequest,
    });

// Solicitud para obtener el plan de cuentas con paginación
const getAccountinPlanRequest = async (page: number, limit: number): Promise<{ data: AccountingPlanResponseType[], total: number }> => {
    const response = await http.get(`accounting-plan?page=${page}&limit=${limit}`);
    return response.data; // Asegúrate que response.data tenga la estructura correcta
};

// Hook para obtener el plan de cuentas con paginación
export const useGetAccountingPlan = (page: number, limit: number) =>
    useQuery({
        queryKey: ['GetAccountingPlan', page, limit],
        queryFn: () => getAccountinPlanRequest(page, limit),
        keepPreviousData: true, // Mantiene los datos anteriores mientras se obtienen nuevos datos
    });
