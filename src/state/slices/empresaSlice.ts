import { EmpresaResponseType } from '@/api/empresas/empresa-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresaState {
    selectedEmpresa: EmpresaResponseType
}

const initialState: EmpresaState = {
    selectedEmpresa: {} as EmpresaResponseType, // Type assertion
};

const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
        setSelectedEmpresa(state, action: PayloadAction<EmpresaResponseType>) {
            state.selectedEmpresa = action.payload;
        },
    },
});

export const { setSelectedEmpresa } = empresaSlice.actions;
export default empresaSlice.reducer;
