
import {
    Box,
    Typography
} from '@mui/material';
import TransactionTable from '@/components/transaction/transaction-table';

export function Transaction(): React.JSX.Element {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Asientos Contables</Typography>
            <TransactionTable />
        </Box>
    );
}

export default Transaction;