import { useState } from 'react';
import { useGetTransaccionContablePaginated, useCreateTransaccionContable, useUpdateTransaccionContable, useDeleteTransaccionContable } from '@/api/transaccion_contable/transaccion-contable-request';
import { TransaccionContableRequestType, TransaccionContableResponseType } from '@/api/transaccion_contable/transaccion-contable-types';
import { normalizeCode } from '@/utils/validators';

const useTransaccionContable = (page: number, rowsPerPage: number, empresa_id: number) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: transactionsData, isLoading, isError, refetch } = useGetTransaccionContablePaginated(page, rowsPerPage, empresa_id);
    const transactions = transactionsData?.data || [];
    const totaltransactions = transactionsData?.total || 0;

    //const { data: alltransactions } = useGetTransaccionContable();

    const createTransaccionContable = useCreateTransaccionContable();
    const updateTransaccionContable = useUpdateTransaccionContable();
    const deleteTransaccionContable = useDeleteTransaccionContable();

    const addTransaction = async (newTransaction: TransaccionContableRequestType) => {

        if (newTransaction.codigo_transaccion && newTransaction.nombre && newTransaction.secuencial) {
            const existingCode = transactions.some((transaction: TransaccionContableResponseType) => 
                normalizeCode(transaction.codigo_transaccion) === normalizeCode(newTransaction.codigo_transaccion)
            );

            if (existingCode) {
                setError('El código de transaccion ya existe. Por favor, use un código diferente.');
                return;
            }


            try {
                await createTransaccionContable.mutateAsync(newTransaction);
                setSuccess('Transaccion agregada exitosamente.');
                refetch();
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error al crear la nueva transaccion');
            }
        }else {
            setError('Por favor, ingrese tanto el código, el nombre y el secuencial de la transaccion.');
        }    
    };

    const updateTransaction = async (id: number, data: { codigo_transaccion: string; nombre: string; secuencial: string; lectura: number; activo:boolean, empresa_id: number }, empresa_id: number) => {

        try {
            await updateTransaccionContable.mutateAsync({ id, data, empresa_id });
            setSuccess('Cambios guardados exitosamente.');
            refetch();
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la transaccion';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }; 

    const deleteTransaction = async (codigo_transaccion: string, empresa_id: number): Promise<{ success: boolean; error?: string }> => {

        try {
            await deleteTransaccionContable.mutateAsync({code: codigo_transaccion, empresa_id});
            setSuccess('Cuenta eliminada exitosamente.');
            refetch();
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al eliminar la transaccion";
            setError(error instanceof Error ? error.message : 'Error al eliminar la transaccion');
            return { success: false, error: errorMessage };
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        transactions,
        totaltransactions,
        //alltransactions,
        isLoading,
        isError,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        error,
        success,
        clearMessages
    };
};

export default useTransaccionContable;