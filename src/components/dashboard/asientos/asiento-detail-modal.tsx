// src/components/AsientoDetailsModal.tsx

import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     Typography,
     Box,
     IconButton,

     Card,
     TableContainer,
     Table,
     TableHead,
     TableRow,
     TableCell,
     TableBody,
     Stack,
     Button,
     Divider,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Asiento } from '@/api/asientos/asientos-types';
import { RouterLink } from '@/components/core/link';
import { paths } from '@/paths';
import { PropertyList } from '@/components/core/property-list';
import { PropertyItem } from '@/components/core/property-item';

interface AsientoDetailsModalProps {
     open: boolean;
     onClose: () => void;
     asiento: Asiento | null;
     previewId?: number; 
}


const AsientoDetailsModal: React.FC<AsientoDetailsModalProps> = ({ open, onClose, asiento, previewId }) => {
     //console.log(previewId);
     return (
          <Dialog
               open={open}
               onClose={onClose}
               maxWidth="sm"
               sx={{
                    '& .MuiDialog-container': { justifyContent: 'flex-end' },
                    '& .MuiDialog-paper': { height: '100%', width: '100%' },
               }}
          >
               <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                         <Typography variant="h6">Detalles del Asiento</Typography>
                         <IconButton onClick={onClose}>
                              <XIcon />
                         </IconButton>
                    </Box>
               </DialogTitle>
               <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
                    {asiento ? (
                         <Stack spacing={3} sx={{ flex: '1 1 auto', overflowY: 'auto' }}>
                              <Stack spacing={3}>
                                   <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'end' }}>
                                   {previewId !== undefined && (
                                        <Button
                                             color="secondary"
                                             component={RouterLink}
                                             href={`${paths.dashboard.asientos.details(previewId)}`}
                                             startIcon={<PencilSimpleIcon />}
                                        >
                                             Editar
                                        </Button>
                                   )}
                                   </Stack>
                                   <Card sx={{ borderRadius: 1 }} variant="outlined">
                                        <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': '12px 24px' }}>
                                             {(
                                                  [
                                                       {
                                                            key: 'ID',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.id}
                                                                 </Typography>
                                                            ),
                                                       },
                                                       {
                                                            key: 'Fecha de Emisión',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.fecha_emision}
                                                                 </Typography>
                                                            ),
                                                       },
                                                       {
                                                            key: 'Número de Asiento',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.nro_asiento}
                                                                 </Typography>
                                                            ),
                                                       },
                                                       {
                                                            key: 'Tipo de Transacción',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.codigo_transaccion}
                                                                 </Typography>
                                                            ),
                                                       },
                                                       {
                                                            key: 'Total Debe',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.total_debe}
                                                                 </Typography>
                                                            ),
                                                       },
                                                       {
                                                            key: 'Total Haber',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.total_haber}
                                                                 </Typography>
                                                            ),
                                                       },
                                                       {
                                                            key: 'Comentario',
                                                            value: (
                                                                 <Typography variant="subtitle2">
                                                                      {asiento?.comentario}
                                                                 </Typography>
                                                            ),
                                                       },

                                                  ] satisfies { key: string; value: React.ReactNode }[]
                                             ).map(
                                                  (item): React.JSX.Element => (
                                                       <PropertyItem key={item.key} name={item.key} value={item.value} />
                                                  )
                                             )}
                                        </PropertyList>
                                   </Card>
                              </Stack>
                              <Stack spacing={3}>
                                   <Typography variant="h6">Line items</Typography>
                                   <Card sx={{ borderRadius: 1 }} variant="outlined">
                                        <Box sx={{ overflowX: 'auto' }}>
                                             <TableContainer>
                                                  <Table size="small">
                                                       <TableHead>
                                                            <TableRow>
                                                                 <TableCell>Cuenta</TableCell>
                                                                 <TableCell>Debe</TableCell>
                                                                 <TableCell>Haber</TableCell>
                                                                 <TableCell>Nota</TableCell>
                                                            </TableRow>
                                                       </TableHead>
                                                       <TableBody>
                                                            {asiento.lineItems?.map((item, index) => (
                                                                 <TableRow key={index}>
                                                                      <TableCell>{item.cta}  {item.cta_nombre}</TableCell>
                                                                      <TableCell>{item.debe}</TableCell>
                                                                      <TableCell>{item.haber}</TableCell>
                                                                      <TableCell>{item.nota || 'N/A'}</TableCell>
                                                                 </TableRow>
                                                            ))}
                                                       </TableBody>
                                                  </Table>
                                             </TableContainer>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
                                             <Stack spacing={2} sx={{ width: '300px', maxWidth: '100%' }}>
                                                  <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                                                       <Typography variant="body2">Total Debe</Typography>
                                                       <Typography variant="body2">
                                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asiento.total_debe)}
                                                       </Typography>
                                                  </Stack>
                                                  <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                                                       <Typography variant="body2">Total Haber</Typography>
                                                       <Typography variant="body2">
                                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(asiento.total_haber)}
                                                       </Typography>
                                                  </Stack>
                                                  <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                                                       <Typography variant="subtitle1">Total</Typography>
                                                       <Typography variant="subtitle1">
                                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                                                                 (Number(asiento.total_debe) || 0) - (Number(asiento.total_haber) || 0)
                                                            )}
                                                       </Typography>
                                                  </Stack>
                                             </Stack>
                                        </Box>
                                   </Card>
                              </Stack>
                         </Stack>
                    ) : (
                         <Typography variant="body2">No hay detalles disponibles.</Typography>
                    )}
               </DialogContent>
          </Dialog>
     );
};

export default AsientoDetailsModal;
