import { EmpresaResponseType } from '@/api/empresas/empresa-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresaState {
    selectedEmpresa: EmpresaResponseType
}

const initialState: EmpresaState = {
    selectedEmpresa: {} as EmpresaResponseType,
};

const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
        setSelectedEmpresa(state, action: PayloadAction<EmpresaResponseType>) {
            state.selectedEmpresa = action.payload;
        },
        resetEmpresaState: () => initialState,
    },
});

export const { setSelectedEmpresa, resetEmpresaState } = empresaSlice.actions;
export default empresaSlice.reducer;
