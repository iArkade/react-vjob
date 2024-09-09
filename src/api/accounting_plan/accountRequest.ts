import { useMutation, useQuery } from "react-query";
import http from "../http";
import { AccountingPlanRequestType, AccountingPlanResponseType } from "./account.types";


const createAccountingPlanRequest = (data: AccountingPlanRequestType) =>
    http.post('accounting-plan', { code: data.code, name: data.name });

export const useCreateAccountingPlan = () =>
    useMutation({
        mutationKey: ['CreateAccountingPlan'],
        mutationFn: createAccountingPlanRequest,
    });

    
const getAccountinPlanRequest = async (): Promise<AccountingPlanResponseType[]> => {
    const response = await http.get('accounting-plan');
    return response.data; // Make sure response.data is the correct type
};

export const useGetAccountingPlan = () =>
    useQuery({
        queryKey: ['GetAccountingPlan'],
        queryFn: getAccountinPlanRequest,
    });

