import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     TextField,
     Typography,
     Button,
     Box,
     IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { EmpresaRequestType } from '@/api/empresas/empresa-types';

interface CreateCompanyModalProps {
     open: boolean;
     formData: EmpresaRequestType;
     formErrors: { [key: string]: string };
     onClose: () => void;
     onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
     onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Para manejar el cambio del logo
     onSave: () => void;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
     open,
     formData,
     formErrors,
     onClose,
     onInputChange,
     onLogoChange,
     onSave,
}) => (
     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>
               <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Detalles del Asiento</Typography>
                    <IconButton onClick={onClose}>
                         <CloseIcon />
                    </IconButton>
               </Box>
          </DialogTitle>
          <DialogContent>
               <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Campos individuales */}
                    <TextField
                         label="Código"
                         variant="outlined"
                         fullWidth
                         name="codigo"
                         value={formData.codigo}
                         onChange={onInputChange}
                         size="small"
                    />
                    <TextField
                         label="RUC"
                         variant="outlined"
                         fullWidth
                         name="ruc"
                         value={formData.ruc}
                         onChange={onInputChange}
                         size="small"
                         error={!!formErrors.ruc}
                         helperText={formErrors.ruc}
                    />
                    <TextField
                         label="Nombre"
                         variant="outlined"
                         fullWidth
                         name="nombre"
                         value={formData.nombre}
                         onChange={onInputChange}
                         size="small"
                    />
                    <TextField
                         label="Correo"
                         variant="outlined"
                         fullWidth
                         name="correo"
                         value={formData.correo}
                         onChange={onInputChange}
                         size="small"
                    />
                    <TextField
                         label="Teléfono"
                         variant="outlined"
                         fullWidth
                         name="telefono"
                         value={formData.telefono}
                         onChange={onInputChange}
                         size="small"
                    />
                    <TextField
                         label="Dirección"
                         variant="outlined"
                         fullWidth
                         name="direccion"
                         value={formData.direccion}
                         onChange={onInputChange}
                         size="small"
                    />

                    {/* Campo para subir el logo */}
                    <Box>
                         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Logo
                         </Typography>
                         <input
                              accept="image/*"
                              type="file"
                              onChange={onLogoChange} // Manejar cambio específico del logo
                              style={{ display: 'block', width: '100%' }}
                         />
                    </Box>

                    {/* Botón Guardar */}
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                         <Button variant="contained" color="primary" onClick={onSave}>
                              Guardar
                         </Button>
                    </Box>
               </Box>
          </DialogContent>
     </Dialog>
);
