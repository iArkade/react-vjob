import { useState } from 'react';
import { useGetCentroCostoPaginated, useCreateCentroCosto, useUpdateCentroCosto, useDeleteCentroCosto, useGetCentroCosto } from '@/api/centro_costo/centro-costo-request';
import { CentroCostoRequestType, CentroCostoResponseType } from '@/api/centro_costo/centro-costo.types';
import { normalizeCode } from '@/utils/validators';

const useCentroCosto = (page: number, rowsPerPage: number) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { data: costCentersData, isLoading, isError, refetch } = useGetCentroCostoPaginated(page, rowsPerPage);
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

    const updatecostCenter = async (id: number, data: { codigo: string; nombre: string; activo:boolean }) => {

        try {
            await updateCentroCosto.mutateAsync({ id, data });
            setSuccess('Cambios guardados exitosamente.');
            refetch();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error al actualizar la cuenta');
        }
    };

    const deletecostCenter = async (codigo: string) => {

        try {
            await deleteCentroCosto.mutateAsync(codigo);
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