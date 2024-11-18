import { Visibility } from "@mui/icons-material";
import { Avatar, Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import AmexIcon from '@mui/icons-material/CreditCard';
import ApplePayIcon from '@mui/icons-material/Apple';
import GooglePayIcon from '@mui/icons-material/Google';
import VisaIcon from '@mui/icons-material/CreditCard';

type OrderStatus = 'Pendiente' | 'Completo' | 'Cancelado' | 'Rechazado';

const statusColors: Record<OrderStatus, 'default' | 'error' | 'warning' | 'success'> = {
     Pendiente: 'warning',
     Completo: 'success',
     Cancelado: 'error',
     Rechazado: 'default',
};

const orders = [
     {
          date: 'NOV 6',
          order: 'ORD-005',
          products: 1,
          amount: '$56.70',
          paymentMethod: { type: 'Visa', icon: <VisaIcon />, lastDigits: '4011' },
          customer: { name: 'Penjani Inyene', email: 'penjani.inyene@domain.com', avatar: '/path/to/avatar1.jpg' },
          status: 'Pendiente' as OrderStatus,
     },
     {
          date: 'NOV 6',
          order: 'ORD-004',
          products: 1,
          amount: '$49.12',
          paymentMethod: { type: 'American Express', icon: <AmexIcon />, lastDigits: '5678' },
          customer: { name: 'Jie Yan', email: 'jie.yan@domain.com', avatar: '/path/to/avatar2.jpg' },
          status: 'Completo' as OrderStatus,
     },
     {
          date: 'NOV 6',
          order: 'ORD-003',
          products: 2,
          amount: '$18.75',
          paymentMethod: { type: 'Apple Pay', icon: <ApplePayIcon />, lastDigits: '' },
          customer: { name: 'Fran Perez', email: 'fran.perez@domain.com', avatar: '/path/to/avatar3.jpg' },
          status: 'Cancelado' as OrderStatus,
     },
     {
          date: 'NOV 5',
          order: 'ORD-002',
          products: 1,
          amount: '$49.99',
          paymentMethod: { type: 'Google Pay', icon: <GooglePayIcon />, lastDigits: '' },
          customer: { name: 'Carson Darrin', email: 'carson.darrin@domain.com', avatar: '/path/to/avatar4.jpg' },
          status: 'Rechazado' as OrderStatus,
     },
];


export function AsientoTable() {
     const [page, setPage] = useState(0);
     const [rowsPerPage, setRowsPerPage] = useState(5);

     const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
          setPage(newPage);
     };

     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
     };

     const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

     return (
          <TableContainer component={Paper}>
               <Table>
                    <TableHead>
                         <TableRow>
                              <TableCell>Order</TableCell>
                              <TableCell>Payment Method</TableCell>
                              <TableCell>Customer</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Actions</TableCell>
                         </TableRow>
                    </TableHead>
                    <TableBody>
                         {paginatedOrders.map((order, index) => (
                              <TableRow key={index}>
                                   <TableCell>
                                        <Box display="flex" flexDirection="column">
                                             <Typography variant="body2" color="textSecondary">{order.date}</Typography>
                                             <Typography variant="subtitle2">{order.order}</Typography>
                                             <Typography variant="body2" color="textSecondary">{order.products} products • {order.amount}</Typography>
                                        </Box>
                                   </TableCell>
                                   <TableCell>
                                        <Box display="flex" alignItems="center">
                                             {order.paymentMethod.icon}
                                             <Typography variant="body2" sx={{ ml: 1 }}>{order.paymentMethod.type}</Typography>
                                             <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>**** {order.paymentMethod.lastDigits}</Typography>
                                        </Box>
                                   </TableCell>
                                   <TableCell>
                                        <Box display="flex" alignItems="center">
                                             <Avatar alt={order.customer.name} src={order.customer.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                                             <Box>
                                                  <Typography variant="subtitle2">{order.customer.name}</Typography>
                                                  <Typography variant="body2" color="textSecondary">{order.customer.email}</Typography>
                                             </Box>
                                        </Box>
                                   </TableCell>
                                   <TableCell>
                                        <Chip
                                             label={order.status}
                                             color={statusColors[order.status as OrderStatus]}
                                             variant="outlined"
                                             size="small"
                                        />
                                   </TableCell>
                                   <TableCell align="right">
                                        <Visibility fontSize="small" sx={{ color: 'action.active' }} />
                                   </TableCell>
                              </TableRow>
                         ))}
                    </TableBody>
               </Table>
               <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
               />
          </TableContainer>
     );
}