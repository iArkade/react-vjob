import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     Typography,
     Box,
     IconButton,
} from '@mui/material';
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { EmpresaRequestType } from '@/api/empresas/empresa-types';
import { UseFormReturn } from 'react-hook-form';
import { EmpresaForm } from './company-form';

interface CreateEmpresaDialogProps {
     open: boolean;
     onClose: () => void;
     form: UseFormReturn<EmpresaRequestType>;
     preview: string | null;
     onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
     onSubmit: (data: EmpresaRequestType) => Promise<void>;
}

export const CreateEmpresaDialog: React.FC<CreateEmpresaDialogProps> = ({
     open,
     onClose,
     form,
     preview,
     onFileChange,
     onSubmit,
}) => {
     return (
          <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
               <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                         <Typography variant="h6">Crear Empresa</Typography>
                         <IconButton onClick={onClose}>
                              <XIcon />
                         </IconButton>
                    </Box>
               </DialogTitle>
               <DialogContent>
                    <EmpresaForm
                         form={form}
                         preview={preview}
                         onFileChange={onFileChange}
                         onSubmit={onSubmit}
                    />
               </DialogContent>
          </Dialog>
     );
};
