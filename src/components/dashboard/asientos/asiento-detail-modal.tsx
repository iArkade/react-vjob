// src/components/AsientoDetailsModal.tsx

import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     Button,
     Typography,
     Box
} from '@mui/material';
import { Asiento } from '@/api/asientos/asientos-types';

interface AsientoDetailsModalProps {
     open: boolean;
     onClose: () => void;
     asiento: Asiento | null;
}

const AsientoDetailsModal: React.FC<AsientoDetailsModalProps> = ({ open, onClose, asiento }) => {
     return (
          <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
               <DialogTitle>Detalles del Asiento</DialogTitle>
               <DialogContent>
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
               <DialogActions>
                    <Button onClick={onClose} color="primary">Cerrar</Button>
               </DialogActions>
          </Dialog>
     );
};

export default AsientoDetailsModal;
