import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Snackbar, Alert, CircularProgress } from '@mui/material';
import AccountRow from './accounting-row';
import AccountForm from './accounting-form';
import useAccountingPlan from '@/hooks/use-accountingPlan';

const AccountingPlanTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { accounts, isLoading, isError, addAccount, updateAccount, deleteAccount, error, success, clearMessages } = useAccountingPlan(page + 1, rowsPerPage);

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">Error al cargar las cuentas</Alert>;

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <AccountForm onSubmit={addAccount} />
                    {accounts.map(account => (
                        <AccountRow
                            key={account.id}
                            account={account}
                            onUpdate={updateAccount}
                            onDelete={deleteAccount}
                        />
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={accounts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
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
        </>
    );
};

export default AccountingPlanTable;