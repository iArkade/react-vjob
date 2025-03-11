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
     const {
          data: accountData,
          isLoading,
          isError
     } = useGetAccountingPlanPaginated(1, 1000, selectedEmpresa.id);


     const accounts = accountData?.data || [];

     const isSelectable = (code: string) => !code.endsWith('.');

     // Estado para el filtro de búsqueda
     const [searchTerm, setSearchTerm] = useState('');

     // Filtrar cuentas por nombre
     const filteredAccounts = accounts.filter(account =>
          account.name.toLowerCase().includes(searchTerm.toLowerCase())
     );

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
                                   {filteredAccounts.map((account) => (
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
                                   ))}
                              </TableBody>
                         </Table>
                    </TableContainer>
               </DialogContent>
               <DialogActions>
                    <Button onClick={onClose} color="primary">
                         Cerrar
                    </Button>
               </DialogActions>
          </Dialog>
     );
};
