import { useState } from 'react';
import { useGetCentroCostoPaginated, useCreateCentroCosto, useUpdateCentroCosto, useDeleteCentroCosto } from '@/api/centro_costo/centro-costo-request';
import { CentroCostoRequestType, CentroCostoResponseType } from '@/api/centro_costo/centro-costo.types';
import { normalizeCode } from '@/utils/validators';

const useCentroCosto = (page: number, rowsPerPage: number, empresa_id: number) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: costCentersData, isLoading, isError, refetch } = useGetCentroCostoPaginated(page, rowsPerPage, empresa_id);
    const costCenters = costCentersData?.data || [];
    const totalcostCenters = costCentersData?.total || 0;

    //const { data: allcostCenters } = useGetCentroCosto();

    const createCentroCosto = useCreateCentroCosto();
    const updateCentroCosto = useUpdateCentroCosto();
    const deleteCentroCosto = useDeleteCentroCosto();

    const addcostCenter = async (newcostCenter: CentroCostoRequestType) => {

        if (newcostCenter.codigo && newcostCenter.nombre) {
            const existingCode = costCenters.some((costCenter: CentroCostoResponseType) => 
                normalizeCode(costCenter.codigo) === normalizeCode(newcostCenter.codigo)
            );

            if (existingCode) {
                setError('El código ya existe. Por favor, use un código diferente.');
                return;
            }


            try {
                await createCentroCosto.mutateAsync(newcostCenter);
                setSuccess('Transaccion agregada exitosamente.');
                refetch();
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error al crear la nueva transaccion');
            }
        }else {
            setError('Por favor, ingrese tanto el código y el nombre de la transaccion.');
        }    
    };

    const updatecostCenter = async (id: number, data: { codigo: string, nombre: string, activo:boolean, empresa_id: number }, empresa_id: number) => {
        try {
            await updateCentroCosto.mutateAsync({ id, data, empresa_id });
            setSuccess('Cambios guardados exitosamente.');
            refetch();
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la cuenta';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const deletecostCenter = async (codigo: string, empresa_id: number): Promise<{ success: boolean; error?: string }> => {

        try {
            await deleteCentroCosto.mutateAsync({code: codigo, empresa_id});
            setSuccess('Cuenta eliminada exitosamente.');
            refetch();
            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al eliminar la cuenta";
            setError(error instanceof Error ? error.message : 'Error al eliminar la cuenta');
            return { success: false, error: errorMessage };
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        costCenters,
        totalcostCenters,
        //allcostCenters,
        isLoading,
        isError,
        addcostCenter,
        updatecostCenter,
        deletecostCenter,
        error,
        success,
        clearMessages
    };
};

export default useCentroCosto;