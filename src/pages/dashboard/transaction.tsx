import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import TransactionClassTable from '@/components/transaction/transaction-table';

export function Page(): React.JSX.Element {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Asientos Contables</Typography>
            <TransactionClassTable />
        </Box>
    );
}

export default Page;