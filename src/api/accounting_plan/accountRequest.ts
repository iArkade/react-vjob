import { useMutation, useQuery } from "react-query";
import http from "../http";
import { AccountingPlanRequestType, AccountingPlanResponseType } from "./account.types";


const createAccountingPlanRequest = (data: AccountingPlanRequestType) =>
    http.post('accountingplan', { code: data.code, description: data.description });

const getAccountinPlanRequest = async (): Promise<AccountingPlanResponseType[]> => {
    const response = await http.get('accountingplan');
    return response.data; // Make sure response.data is the correct type
};

export const useCreateAccountingPlan = () =>
    useMutation({
        mutationKey: ['CreateAccountingPlan'],
        mutationFn: createAccountingPlanRequest,
    });

export const useGetAccountingPlan = () =>
    useQuery({
        queryKey: ['GetAccountingPlan'],
        queryFn: getAccountinPlanRequest,
    });

