import { useEffect, useState } from 'react';
import { useGetAccountingPlanPaginated, useCreateAccountingPlan, useUpdateAccountingPlan, useDeleteAccountingPlan, useGetAccountingPlan } from '@/api/accounting-plan/account-request';
import { AccountingPlanRequestType, AccountingPlanResponseType } from '@/api/accounting-plan/account-types';
import { normalizeCode,  validateHierarchy } from '@/utils/validators';

const useAccountingPlan = (page: number, rowsPerPage: number, refreshTrigger?: number) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: accountsData, isLoading, isError, refetch } = useGetAccountingPlanPaginated(page, rowsPerPage, refreshTrigger);
    const accounts = accountsData?.data || [];
    const totalAccounts = accountsData?.total || 0;

    useEffect(() => {
        // Refetch cuando cambie refreshTrigger
        refetch();
    }, [refreshTrigger, refetch]);

    const { data: allAccounts } = useGetAccountingPlan();

    const createAccountingPlan = useCreateAccountingPlan();
    const updateAccountingPlan = useUpdateAccountingPlan();
    const deleteAccountingPlan = useDeleteAccountingPlan();

    const addAccount = async (newAccount: AccountingPlanRequestType) => {
        // if (!validateCode(newAccount.code)) {
        //     setError('El código debe contener números y puede terminar en punto.');
        //     return;
        // }

        if (newAccount.code && newAccount.name) {
            const existingCode = accounts.some((account: AccountingPlanResponseType) => 
                normalizeCode(account.code) === normalizeCode(newAccount.code)
            );

            if (existingCode) {
                setError('El código de cuenta ya existe. Por favor, use un código diferente.');
                return;
            }

            const hierarchyValidation = validateHierarchy(newAccount.code, accounts);
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

        const hasChildren = accounts.some((account: AccountingPlanResponseType) =>
            account.code.startsWith(data.code + '.') && account.code !== data.code
        );

        if (hasChildren) {
            setError('  No se puede editar una cuenta que tiene subcuentas.');
            return;
        }

        // if (!validateCode(data.code)) {
        //     setError('El código debe contener números y puede terminar en punto.');
        //     return;
        // }

        const hierarchyValidation = validateHierarchy(data.code, accounts);
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
        const hasChildren = accounts.some((account: AccountingPlanResponseType) =>
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
        accounts,
        totalAccounts,
        allAccounts,
        isLoading,
        isError,
        addAccount,
        updateAccount,
        deleteAccount,
        error,
        success,
        clearMessages,
        refetch
    };
};

export default useAccountingPlan;