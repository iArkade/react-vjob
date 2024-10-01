import { useState } from 'react';
import { useGetAccountingPlan, useCreateAccountingPlan, useUpdateAccountingPlan, useDeleteAccountingPlan } from '@/api/accounting_plan/accountRequest';
import { AccountingPlanRequestType, AccountingPlanResponseType } from '@/api/accounting_plan/account.types';
import { normalizeCode, validateCode,  validateHierarchy } from '@/utils/validators';

const useAccountingPlan = (page: number, rowsPerPage: number) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: accounts, isLoading, isError, refetch } = useGetAccountingPlan(page, rowsPerPage);

    const createAccountingPlan = useCreateAccountingPlan();
    const updateAccountingPlan = useUpdateAccountingPlan();
    const deleteAccountingPlan = useDeleteAccountingPlan();

    const addAccount = async (newAccount: AccountingPlanRequestType) => {
        if (!validateCode(newAccount.code)) {
            setError('El código debe contener números y puede terminar en punto.');
            return;
        }

        if (newAccount.code && newAccount.name) {
            const existingCode = accounts?.data.some((account: AccountingPlanResponseType) => 
                normalizeCode(account.code) === normalizeCode(newAccount.code)
            );

            if (existingCode) {
                setError('El código de cuenta ya existe. Por favor, use un código diferente.');
                return;
            }

            const hierarchyValidation = validateHierarchy(newAccount.code, accounts?.data || []);
            if (!hierarchyValidation.isValid) {
                setError(hierarchyValidation.error || 'Error de jerarquía');
                return;
            }

            try {
                await createAccountingPlan.mutateAsync(newAccount);
                setSuccess('Cuenta agregada exitosamente.');
                refetch();
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error al crear la nueva cuenta');
            }
        }else {
            setError('Por favor, ingrese tanto el código como el nombre de la cuenta.');
        }    
    };

    const updateAccount = async (id: number, data: { code: string; name: string }) => {
        if (!validateCode(data.code)) {
            setError('El código debe contener números y puede terminar en punto.');
            return;
        }

        const hierarchyValidation = validateHierarchy(data.code, accounts?.data || []);
        if (!hierarchyValidation.isValid) {
            setError(hierarchyValidation.error || 'Error de jerarquía');
            return;
        }

        try {
            await updateAccountingPlan.mutateAsync({ id, data });
            setSuccess('Cambios guardados exitosamente.');
            refetch();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al actualizar la cuenta');
        }
    };

    const deleteAccount = async (code: string) => {
        const hasChildren = accounts?.data.some((account: AccountingPlanResponseType) =>
            account.code.startsWith(code + '.') && account.code !== code
        );

        if (hasChildren) {
            setError('No se puede eliminar una cuenta que tiene subcuentas.');
            return;
        }

        try {
            await deleteAccountingPlan.mutateAsync(code);
            setSuccess('Cuenta eliminada exitosamente.');
            refetch();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al eliminar la cuenta');
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        accounts: accounts?.data || [],
        isLoading,
        isError,
        addAccount,
        updateAccount,
        deleteAccount,
        error,
        success,
        clearMessages
    };
};

export default useAccountingPlan;