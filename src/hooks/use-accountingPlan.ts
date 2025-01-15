import { useEffect, useState } from 'react';
import { useGetAccountingPlanPaginated, useCreateAccountingPlan, useUpdateAccountingPlan, useDeleteAccountingPlan, useGetAccountingPlan } from '@/api/accounting-plan/account-request';
import { AccountingPlanRequestType, AccountingPlanResponseType } from '@/api/accounting-plan/account-types';
import { normalizeCode, validateCode,  validateHierarchy } from '@/utils/validators';

const useAccountingPlan = (page: number, rowsPerPage: number, empresa_id: number, refreshTrigger?: number) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: accountsData, isLoading, isError, refetch } = useGetAccountingPlanPaginated(page, rowsPerPage, empresa_id, refreshTrigger);
    const accounts = accountsData?.data || [];
    const totalAccounts = accountsData?.total || 0;

    useEffect(() => {
        // Refetch cuando cambie refreshTrigger
        refetch();
    }, [refreshTrigger, refetch]);

    const { data: allAccounts } = useGetAccountingPlan(empresa_id);

    const createAccountingPlan = useCreateAccountingPlan();
    const updateAccountingPlan = useUpdateAccountingPlan();
    const deleteAccountingPlan = useDeleteAccountingPlan();

    const addAccount = async (newAccount: AccountingPlanRequestType) => {
        
        if (!validateCode(newAccount.code)) {
            setError('El código debe contener números y puede terminar en punto.');
            return { success: false, error: 'El código debe contener números y puede terminar en punto.' };
        }

        if (newAccount.code && newAccount.name) {
            const existingCode = accounts.some((account: AccountingPlanResponseType) => 
                normalizeCode(account.code) === normalizeCode(newAccount.code)
            );

            if (existingCode) {
                setError('El código de cuenta ya existe. Por favor, use un código diferente.');
                return { success: false, error: 'El código de cuenta ya existe. Por favor, use un código diferente.' };
            }

            const hierarchyValidation = validateHierarchy(newAccount.code, accounts);
            if (!hierarchyValidation.isValid) {
                setError(hierarchyValidation.error || 'Error de jerarquía');
                return { success: false, error: hierarchyValidation.error || 'Error de jerarquía' };
            }

            try {
                await createAccountingPlan.mutateAsync(newAccount);
                setSuccess('Cuenta agregada exitosamente.');
                refetch();
                return { success: true };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al crear la nueva cuenta';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
        } else {
            setError('Por favor, ingrese tanto el código como el nombre de la cuenta.');
            return { success: false, error: 'Por favor, ingrese tanto el código como el nombre de la cuenta.' };
        }    
    };

    const updateAccount = async (id: number, data: { code: string; name: string, empresa_id: number }, empresa_id: number) => {
        const existingCode = accounts.some((account: AccountingPlanResponseType) => 
            account.id !== id && normalizeCode(account.code) === normalizeCode(data.code)
        );
    
        if (existingCode) {
            setError('El código de cuenta ya existe. Por favor, use un código diferente.');
            return { success: false, error: 'El código de cuenta ya existe. Por favor, use un código diferente.' };
        }
    
        const hasChildren = accounts.some((account: AccountingPlanResponseType) => {
            const normalizedAccountCode = normalizeCode(account.code);
            const normalizedDataCode = normalizeCode(data.code);
    
            return normalizedAccountCode.startsWith(normalizedDataCode + '.') 
                && normalizedAccountCode.split('.').length > normalizedDataCode.split('.').length;
        });
    
        if (hasChildren) {
            setError('No se puede editar una cuenta que tiene subcuentas.');
            return { success: false, error: 'No se puede editar una cuenta que tiene subcuentas.' };
        }
    
        if (!validateCode(data.code)) {
            setError('El código debe contener números y puede terminar en punto.');
            return { success: false, error: 'El código debe contener números y puede terminar en punto.' };
        }
    
        const hierarchyValidation = validateHierarchy(data.code, accounts);
        if (!hierarchyValidation.isValid) {
            setError(hierarchyValidation.error || 'Error de jerarquía');
            return { success: false, error: hierarchyValidation.error || 'Error de jerarquía' };
        }
    
        try {
            await updateAccountingPlan.mutateAsync({ id, data, empresa_id });
            setSuccess('Cambios guardados exitosamente.');
            refetch();
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la cuenta';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };
    

    const deleteAccount = async (code: string, empresa_id: number) => {
        const hasChildren = accounts.some((account: AccountingPlanResponseType) =>
            account.code.startsWith(code + '.') && account.code !== code
        );

        if (hasChildren) {
            setError('No se puede eliminar una cuenta que tiene subcuentas.');
            return { success: false, error: 'No se puede eliminar una cuenta que tiene subcuentas.' };
        }

        try {
            await deleteAccountingPlan.mutateAsync({ code, empresa_id });
            setSuccess('Cuenta eliminada exitosamente.');
            refetch();
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la cuenta';
            setError(errorMessage);
            return { success: false, error: errorMessage };
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