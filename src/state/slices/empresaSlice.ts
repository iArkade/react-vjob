import { EmpresaConRolType } from '@/api/empresas/empresa-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresaState {
    selectedEmpresa: EmpresaConRolType;
}

const initialState: EmpresaState = {
    selectedEmpresa: {} as EmpresaConRolType,
};

const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
        setSelectedEmpresa(state, action: PayloadAction<EmpresaConRolType>) {
            state.selectedEmpresa = action.payload;
        },
        resetEmpresaState: () => initialState,
    },
});

export const { setSelectedEmpresa, resetEmpresaState } = empresaSlice.actions;
export default empresaSlice.reducer;
