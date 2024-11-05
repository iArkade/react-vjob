import React, { useCallback, useMemo, useState } from 'react';
import { 
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    TablePagination,
    Snackbar
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import TransactionRow from './transaction-row';
import TransactionForm from './transaction-form';
import useTransaccionContable from '@/hooks/use-transaction';

const TransactionTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const {
        transactions,
        totaltransactions,
        alltransactions,
        isLoading,
        isError,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        error,
        success,
        clearMessages
    } = useTransaccionContable(page + 1, rowsPerPage);

    const filteredTransactions = transactions.filter(item =>
        item.codigo_transaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const memoizedAccounts = useMemo(() => alltransactions || [], [alltransactions]);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { 
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleRowClick = useCallback((id: number) => {
        setSelectedRowId(prevId => (prevId === id ? null : id));
    }, []);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (isError) {
        return <Alert severity="error">Error al cargar las transacciones</Alert>;
    }


    return (
        <Paper sx={{ p: 2 }}>
            <div style={{ marginBottom: 16 }}>
                <TextField
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Secuencial</TableCell>
                            <TableCell align="center">Lectura</TableCell>
                            <TableCell align="center">Activo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TransactionForm onSubmit={addTransaction} />
                        {filteredTransactions.map((transaction) => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={transaction}
                                onUpdate={updateTransaction}
                                onDelete={deleteTransaction}
                                isSelected={selectedRowId === transaction.id}
                                onRowClick={handleRowClick}
                            />
                        ))}
                        
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totaltransactions}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Snackbar open={!!error} autoHideDuration={6000} onClose={clearMessages}>
                    <Alert onClose={clearMessages} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar open={!!success} autoHideDuration={6000} onClose={clearMessages}>
                    <Alert onClose={clearMessages} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            </TableContainer>
        </Paper>
    );
};

export default TransactionTable;