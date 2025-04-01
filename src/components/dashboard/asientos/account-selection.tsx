import React, { useState } from 'react';
import {
     Dialog,
     DialogActions,
     DialogContent,
     DialogTitle,
     Table,
     TableBody,
     TableCell,
     TableContainer,
     TableHead,
     TableRow,
     Paper,
     Button,
     CircularProgress,
     Typography,
     TextField,
     TablePagination,
} from '@mui/material';
import { useGetAccountingPlanPaginated } from '@/api/accounting-plan/account-request';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';


interface AccountSelectionModalProps {
     open: boolean;
     onClose: () => void;
     onSelect: (code: string, name: string) => void;
}

export const AccountSelectionModal: React.FC<AccountSelectionModalProps> = ({ open, onClose, onSelect }) => {

     const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
     const [page, setPage] = useState(1); // base 1
     const [rowsPerPage, setRowsPerPage] = useState(10);
     const [searchTerm, setSearchTerm] = useState('');

     const {
          data: accountData,
          isLoading,
          isError
     } = useGetAccountingPlanPaginated(page, rowsPerPage, selectedEmpresa.id);


     const accounts = accountData?.data || [];
     const total = accountData?.total || 0;

     const isSelectable = (code: string) => !code.endsWith('.');

     // Filtrar cuentas por nombre
     const filteredAccounts = React.useMemo(() =>
          accounts.filter(account =>
               account.name.toLowerCase().includes(searchTerm.toLowerCase())
          ), [accounts, searchTerm]);

     if (isLoading) return <CircularProgress />;
     if (isError) return <Typography>Error al cargar las cuentas</Typography>;

     return (
          <Dialog open={open} onClose={onClose}>
               <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Seleccione una Cuenta
                    <TextField
                         size="small"
                         variant="outlined"
                         placeholder="Buscar..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         sx={{ ml: 2, width: '50%' }}
                    />
               </DialogTitle>

               <DialogContent>
                    <TableContainer component={Paper}>
                         <Table>
                              <TableHead>
                                   <TableRow>
                                        <TableCell>Codigo</TableCell>
                                        <TableCell>Nombre</TableCell>
                                   </TableRow>
                              </TableHead>
                              <TableBody>
                                   {filteredAccounts.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={2}>
                                                  <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                                                       No se encontraron cuentas con ese nombre.
                                                  </Typography>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        filteredAccounts.map((account) => (
                                             <TableRow
                                                  key={account.code}
                                                  onClick={() => isSelectable(account.code) && onSelect(account.code, account.name)}
                                                  style={{
                                                       cursor: isSelectable(account.code) ? 'pointer' : 'default',
                                                       backgroundColor: isSelectable(account.code) ? 'inherit' : '#d1cdcd',
                                                  }}
                                             >
                                                  <TableCell>{account.code}</TableCell>
                                                  <TableCell>{account.name}</TableCell>
                                             </TableRow>
                                        ))
                                   )}
                              </TableBody>
                         </Table>
                    </TableContainer>
                    <TablePagination
                         component="div"
                         count={total}
                         page={page - 1}
                         rowsPerPage={rowsPerPage}
                         onPageChange={(event, newPage) => setPage(newPage + 1)}
                         onRowsPerPageChange={(event) => {
                              setRowsPerPage(parseInt(event.target.value, 10));
                              setPage(1);
                         }}
                    />
               </DialogContent>
               <DialogActions>
                    <Button onClick={onClose} color="primary">
                         Cerrar
                    </Button>
               </DialogActions>
          </Dialog>
     );
};
