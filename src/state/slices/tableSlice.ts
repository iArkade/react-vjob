import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Row {
    id: string;
    code: string;
    name: string;
    isNew?: boolean;
    isEdited?: boolean;
}

interface TableState {
    rows: Row[];
}

const initialState: TableState = {
    rows: [],
};

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        addRow: (state, action: PayloadAction<Row>) => {
            state.rows.push({ ...action.payload, isNew: true });
        },
        addFetchedRows: (state, action: PayloadAction<Row[]>) => {
            // Add rows fetched from the server, mark them as not new or edited
            action.payload.forEach(row => {
            state.rows.push({ ...row, isNew: false, isEdited: false });
            });
        },
        updateRow: (
            state,
            action: PayloadAction<{ index: number; field: keyof Row; value: string }>
        ) => {
            const { index, field, value } = action.payload;
            const row = state.rows[index];

            if (field in row) {
                (row[field] as string) = value;
            }

            row.isEdited = true;
        },
    },
});

export const { addRow, updateRow, addFetchedRows } = tableSlice.actions;
export default tableSlice.reducer;
