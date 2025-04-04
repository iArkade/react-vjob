import { useGetAccountingPlan } from '@/api/accounting-plan/account-request';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

interface CuentasSelectionModalProps {
     open: boolean;
     onClose: () => void;
     empresaId: number;
     onCuentaSeleccionada: (code: string) => void;
}

const CuentasSelectionModal: React.FC<CuentasSelectionModalProps> = ({
     open,
     onClose,
     empresaId,
     onCuentaSeleccionada,
}) => {
     const [searchTerm, setSearchTerm] = useState('');

     const { data: accounts = [], isLoading, isError } = useGetAccountingPlan(empresaId);

     const filteredAccounts = useMemo(() => {
          if (!searchTerm.trim()) return accounts;

          return accounts.filter((item) => {
               const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

               const normalizedSearch = searchTerm.endsWith('.') ? searchTerm : `${searchTerm}.`;
               const codeMatch =
                    item.code === normalizedSearch.slice(0, -1) ||
                    item.code.startsWith(normalizedSearch) ||
                    item.code === searchTerm;

               return nameMatch || codeMatch;
          });
     }, [accounts, searchTerm]);

     useEffect(() => {
          if (!open) setSearchTerm('');
     }, [open]);

     if (isLoading)
          return (
               <Dialog open={open} onClose={onClose}>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                         <CircularProgress />
                    </DialogContent>
               </Dialog>
          );

     if (isError)
          return (
               <Dialog open={open} onClose={onClose}>
                    <DialogContent>
                         <Typography color="error">Error al cargar las cuentas.</Typography>
                    </DialogContent>
                    <DialogActions>
                         <Button onClick={onClose}>Cerrar</Button>
                    </DialogActions>
               </Dialog>
          );

     return (
          <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
               <DialogTitle
                    sx={{
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'space-between',
                         gap: 2,
                    }}
               >
                    Seleccione una Cuenta
                    <TextField
                         size="small"
                         variant="outlined"
                         placeholder="Buscar..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         sx={{ width: '50%' }}
                    />
               </DialogTitle>

               <DialogContent dividers>
                    <TableContainer component={Paper}>
                         <Table size="small">
                              <TableHead>
                                   <TableRow>
                                        <TableCell>Código</TableCell>
                                        <TableCell>Nombre</TableCell>
                                   </TableRow>
                              </TableHead>
                              <TableBody>
                                   {filteredAccounts.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={2} align="center">
                                                  No se encontraron cuentas.
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        filteredAccounts.map((account) => (
                                             <TableRow
                                                  key={account.code}
                                                  hover
                                                  sx={{ cursor: 'pointer' }}
                                                  onClick={() => onCuentaSeleccionada(account.code)}
                                             >
                                                  <TableCell>{account.code}</TableCell>
                                                  <TableCell>{account.name}</TableCell>
                                             </TableRow>
                                        ))
                                   )}
                              </TableBody>
                         </Table>
                    </TableContainer>
               </DialogContent>

               <DialogActions>
                    <Button onClick={onClose}>Cerrar</Button>
               </DialogActions>
          </Dialog>
     );
};

export default CuentasSelectionModal;