import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "../http";
import { AccountingPlanRequestType, AccountingPlanResponseType } from "./account.types";

// Solicitud para crear un plan de cuentas
const createAccountingPlanRequest = (data: AccountingPlanRequestType) =>
    http.post('accounting-plan', { code: data.code, name: data.name });

export const useCreateAccountingPlan = () => {
    const queryClient = useQueryClient(); // Aquí obtienes queryClient
    return useMutation({
        mutationKey: ['CreateAccountingPlan'],
        mutationFn: createAccountingPlanRequest,
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan'); // Invalida la caché
        },
    });
};

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

// Solicitud para actualizar un plan de cuentas
const updateAccountingPlanRequest = (id: number, data: AccountingPlanRequestType) =>
    http.put(`accounting-plan/${id}`, { code: data.code, name: data.name });

// Hook para actualizar el plan de cuentas
export const useUpdateAccountingPlan = () => {
    const queryClient = useQueryClient(); // Obtén queryClient aquí
    return useMutation({
        mutationKey: ['UpdateAccountingPlan'],
        mutationFn: ({ id, data }: { id: number, data: AccountingPlanRequestType }) => updateAccountingPlanRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan'); // Invalida la caché después de actualizar
        },
    });
};

// Solicitud para eliminar un plan de cuentas
const deleteAccountingPlanRequest = (code: string) =>
    http.delete(`accounting-plan/${code}`);

// Hook para eliminar el plan de cuentas
export const useDeleteAccountingPlan = () => {
    const queryClient = useQueryClient(); // Obtén queryClient aquí
    return useMutation({
        mutationKey: ['DeleteAccountingPlan'],
        mutationFn: (code: string) => deleteAccountingPlanRequest(code),
        onSuccess: () => {
            queryClient.invalidateQueries('GetAccountingPlan'); // Invalida la caché después de eliminar
        },
    });
};
