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
import { useGetAccountingPlan } from '@/api/accounting-plan/account-request';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';


interface AccountSelectionModalProps {
     open: boolean;
     onClose: () => void;
     onSelect: (code: string, name: string) => void;
}

export const AccountSelectionModal: React.FC<AccountSelectionModalProps> = ({ open, onClose, onSelect }) => {

     const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
     const [searchTerm, setSearchTerm] = useState('');

     const {
          data: accounts = [],
          isLoading,
          isError
     } = useGetAccountingPlan(selectedEmpresa.id);

     //console.log(accounts)

     const isSelectable = (code: string) => !code.endsWith('.');

     //Filtrar por codigo y nombre
     const filteredAccounts = React.useMemo(() => {
          if (!searchTerm.trim()) return accounts || [];

          return (accounts || []).filter(item => {
               //busqueda por nombre y sin acentos

               // const normalize = (text: string) =>
               //      text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
               // const nameMatch = normalize(item.name).includes(normalize(searchTerm));
               
               // Búsqueda por nombre 
               const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

               // Búsqueda jerárquica por código
               const normalizedSearch = searchTerm.endsWith('.') ? searchTerm : `${searchTerm}.`;
               const codeMatch =
                    item.code === normalizedSearch.slice(0, -1) ||  // Ej: busca "4." encuentra "4"
                    item.code.startsWith(normalizedSearch) ||      // Ej: busca "4." encuentra "4.1", "4.1.1"
                    item.code === searchTerm;                       // Ej: busca "4" encuentra "4" (sin punto)

               return nameMatch || codeMatch;
          });
     }, [accounts, searchTerm]);

     React.useEffect(() => {
          if (!open) {
               setSearchTerm('');
          }
     }, [open]);

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
                                                  onClick={() => {
                                                       if (isSelectable(account.code)) {
                                                            onSelect(account.code, account.name);
                                                       }
                                                  }}
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
               </DialogContent>
               <DialogActions>
                    <Button onClick={onClose} color="primary">
                         Cerrar
                    </Button>
               </DialogActions>
          </Dialog>
     );
};
