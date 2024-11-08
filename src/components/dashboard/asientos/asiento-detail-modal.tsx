// src/components/AsientoDetailsModal.tsx

import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     Typography,
     Box,
     IconButton,
     Stack,
     Button
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Asiento } from '@/api/asientos/asientos-types';
import { RouterLink } from '@/components/core/link';
import { paths } from '@/paths';

interface AsientoDetailsModalProps {
     open: boolean;
     onClose: () => void;
     asiento: Asiento | null;
}

const AsientoDetailsModal: React.FC<AsientoDetailsModalProps> = ({ open, onClose, asiento }) => {
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
                         <span>Detalles del Asiento</span>
                         <IconButton onClick={onClose}>
                              <XIcon />
                         </IconButton>
                    </Box>
               </DialogTitle>
               <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
                    <Stack spacing={3} sx={{ flex: '1 1 auto', overflowY: 'auto' }}>
                         <Stack spacing={3}>
                              <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                   <Typography variant="h6">Details</Typography>
                                   <Button
                                        color="secondary"
                                        component={RouterLink}
                                        href={paths.dashboard.orders.details('1')}
                                        startIcon={<PencilSimpleIcon />}
                                   >
                                        Edit
                                   </Button>
                              </Stack>
                              
                         </Stack>
                    </Stack>
                    {asiento ? (
                         <>
                              <Typography variant="subtitle1">ID: {asiento.id}</Typography>
                              <Typography variant="body2">Fecha de Emisión: {asiento.fecha_emision}</Typography>
                              <Typography variant="body2">Número de Asiento: {asiento.nro_asiento}</Typography>
                              <Typography variant="body2">Tipo de Transacción: {asiento.tipo_transaccion}</Typography>
                              <Typography variant="body2">Total Debe: {asiento.total_debe}</Typography>
                              <Typography variant="body2">Total Haber: {asiento.total_haber}</Typography>
                              <Typography variant="body2">Comentario: {asiento.comentario}</Typography>
                              <Typography variant="subtitle1" mt={2}>Line Items:</Typography>
                              {asiento.lineItems?.map((item, index) => (
                                   <Box key={index} mb={1}>
                                        <Typography variant="body2">Cuenta: {item.cta} - {item.cta_nombre}</Typography>
                                        <Typography variant="body2">Debe: {item.debe} | Haber: {item.haber}</Typography>
                                        <Typography variant="body2">Nota: {item.nota || 'N/A'}</Typography>
                                   </Box>
                              ))}
                         </>
                    ) : (
                         <Typography variant="body2">No hay detalles disponibles.</Typography>
                    )}
               </DialogContent>

          </Dialog>
     );
};

export default AsientoDetailsModal;
