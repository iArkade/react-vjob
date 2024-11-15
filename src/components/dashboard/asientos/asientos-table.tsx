import {
     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
     Typography, Chip, Paper, Box,
     TablePagination,
     CircularProgress,
     Alert,
     Button,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { Asiento } from '@/api/asientos/asientos-types';

type OrderStatus = 'Pendiente' | 'Activo' | 'Cancelado' | 'Rechazado';

const statusColors: Record<OrderStatus, 'default' | 'error' | 'warning' | 'success'> = {
     Pendiente: 'warning',
     Activo: 'success',
     Cancelado: 'error',
     Rechazado: 'default',
};

type AsientoTableProps = {
     asientos: Asiento[] | undefined;
     isLoading: boolean;
     isError: boolean;
     onOpenModal: (asiento: Asiento) => void;
     refetch: () => void;
};

export default function AsientoTable({ asientos, isLoading, isError, onOpenModal, refetch }: AsientoTableProps) {
     const [page, setPage] = useState(0);
     const [rowsPerPage, setRowsPerPage] = useState(5);

     const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
          setPage(newPage);
     };

     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
     };

     const paginatedAsientos = asientos?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

     if (isLoading) {
          return <CircularProgress />;
     }

     if (isError) {
          return <Alert severity="error">Error al cargar los asientos</Alert>;
     }
     return (
          <>
               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mr={2} mt={2}>
                    <Typography variant="h5" ml={2}>Lista de Asientos</Typography>
                    <Button variant="contained" onClick={refetch}>
                         Recargar Asientos
                    </Button>
               </Box>
               <TableContainer component={Paper}>
                    <Table>
                         <TableHead>
                              <TableRow>
                                   <TableCell>Asiento</TableCell>
                                   <TableCell>Comentario</TableCell>
                                   <TableCell>Tipo Transacción</TableCell>
                                   <TableCell>Estado</TableCell>
                                   <TableCell>Total Debe</TableCell>
                                   <TableCell>Total Haber</TableCell>
                                   <TableCell align="right">Acciones</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {paginatedAsientos.map((asiento) => (
                                   <TableRow key={asiento.id}>
                                        <TableCell>
                                             <Box display="flex" flexDirection="column">
                                                  <Typography variant="body2" color="textSecondary">{asiento.fecha_emision}</Typography>
                                                  <Typography variant="subtitle2">#{asiento.nro_asiento}</Typography>
                                                  <Typography variant="body2" color="textSecondary">ID-{asiento.id}</Typography>

                                             </Box>
                                        </TableCell>
                                        <TableCell>{asiento.comentario}</TableCell>
                                        <TableCell>{asiento.tipo_transaccion}</TableCell>
                                        {/* <TableCell>{asiento.estado}</TableCell> */}
                                        <TableCell>
                                             <Chip
                                                  label={asiento.estado}
                                                  color={statusColors[asiento.estado as OrderStatus]}
                                                  variant="outlined"
                                                  size="small"
                                             />
                                        </TableCell>
                                        <TableCell>{asiento.total_debe}</TableCell>
                                        <TableCell>{asiento.total_haber}</TableCell>
                                        <TableCell align="center">
                                             <Visibility
                                                  fontSize="small"
                                                  sx={{
                                                       color: 'action.active',
                                                       cursor: 'pointer',
                                                       '&:hover': {
                                                            color: 'primary.main',
                                                       },
                                                  }}
                                                  onClick={() => onOpenModal(asiento)}
                                             />
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
                    <TablePagination
                         rowsPerPageOptions={[5, 10, 25]}
                         component="div"
                         count={asientos?.length || 0}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         onPageChange={handleChangePage}
                         onRowsPerPageChange={handleChangeRowsPerPage}
                    />
               </TableContainer>
          </>
     );
}