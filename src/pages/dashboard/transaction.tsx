import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import TransactionTable from '@/components/transaction/transaction-table';

export function Page(): React.JSX.Element {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Asientos Contables</Typography>
            <TransactionTable />
        </Box>
    );
}

export default Page;