import * as React from 'react';

import { Avatar, Box, Card, CardContent, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { Timer as TimerIcon } from '@phosphor-icons/react/dist/ssr/Timer';
import { LoginHistoryItem } from '@/api/security/login-history-types';
import { formatLoginDate } from '@/utils/formatLoginDate';

interface LoginHistoryProps {
     logins: LoginHistoryItem[];
     total: number;
     page: number;
     rowsPerPage: number;
     onPageChange: (page: number) => void;
}

export default function LoginHistory({
     logins,
     total,
     page,
     rowsPerPage,
     onPageChange,
}: LoginHistoryProps): React.JSX.Element {

     const handleChangePage = (_: unknown, newPage: number) => {
          onPageChange(Math.max(0, newPage));
     };

     return (
          <Card>
               <CardHeader
                    avatar={
                         <Avatar>
                              <TimerIcon fontSize="var(--Icon-fontSize)" />
                         </Avatar>
                    }
                    title="Historial de Acceso"
               />
               <CardContent>
                    <Paper variant="outlined" sx={{ maxHeight: 700, overflow: 'auto' }}>
                         <TableContainer>
                              <Table stickyHeader>
                                   <TableHead>
                                        <TableRow>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Inicio de Sesión</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Dirección IP</TableCell>
                                             <TableCell sx={{ backgroundColor: '#fafafa' }}>Agente de Usuario</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody>
                                        {logins.map((login) => (
                                             <TableRow key={login.id}>
                                                  <TableCell>
                                                       <Box display="flex" flexDirection="column">
                                                            <Typography variant="subtitle2">{login.userName}</Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                            {formatLoginDate(login.timestamp)}                                                            </Typography>
                                                       </Box>
                                                  </TableCell>
                                                  <TableCell>{login.ip}</TableCell>
                                                  <TableCell>{login.browser}, {login.os}</TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </TableContainer>
                         <TablePagination
                              rowsPerPageOptions={[rowsPerPage]}
                              component="div"
                              count={total}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={() => { }}
                         />
                    </Paper>
               </CardContent>
          </Card>
     );
}