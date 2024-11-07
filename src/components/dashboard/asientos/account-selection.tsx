import React from 'react';
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
} from '@mui/material';
import { useGetAccountingPlanPaginated } from '@/api/accounting-plan/account-request';


interface AccountSelectionModalProps {
     open: boolean;
     onClose: () => void;
     onSelect: (code: string, name: string) => void;
}

export const AccountSelectionModal: React.FC<AccountSelectionModalProps> = ({ open, onClose, onSelect }) => {

     const {
          data: accountData,
          isLoading,
          isError
     } = useGetAccountingPlanPaginated(1, 100);


     const accounts = accountData?.data || [];
     //console.log(accounts)
     const isSelectable = (code: string) => !code.endsWith('.');


     if (isLoading) return <CircularProgress />;
     if (isError) return <Typography>Error al cargar las cuentas</Typography>;

     return (
          <Dialog open={open} onClose={onClose}>
               <DialogTitle>Seleccione una Cuenta</DialogTitle>
               <DialogContent>
                    <TableContainer component={Paper}>
                         <Table>
                              <TableHead>
                                   <TableRow>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Name</TableCell>
                                   </TableRow>
                              </TableHead>
                              <TableBody>
                                   {accounts.map((account) => (
                                        <TableRow
                                             key={account.code}
                                             onClick={() => isSelectable(account.code) && onSelect(account.code, account.name)}
                                             style={{
                                                  cursor: isSelectable(account.code) ? 'pointer' : 'default',
                                                  backgroundColor: isSelectable(account.code) ? 'inherit' : '#f0f0f0',
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
