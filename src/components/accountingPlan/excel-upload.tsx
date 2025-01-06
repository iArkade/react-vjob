import React, { useState } from 'react';
import { useUploadExcel } from '@/api/accounting-plan/account-request';
import { 
    Box, 
    Button, 
    Typography, 
    Alert, 
    Grid,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

interface ExcelUploadProps {
    onSuccessfulUpload?: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onSuccessfulUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorDetails, setErrorDetails] = useState<string[]>([]);

    const uploadExcelMutation = useUploadExcel();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile && selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setError('Por favor, suba un archivo Excel válido (xlsx).');
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = () => {
        if (!file) {
            setError('Por favor, seleccione un archivo para cargar.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        uploadExcelMutation.mutate(formData, {
            onSuccess: () => {
                setSuccessMessage('Archivo cargado exitosamente!');
                setFile(null);
                setErrorDetails([]); 
                onSuccessfulUpload?.();
            },
            onError: (err: any) => {
                const apiError = err?.response?.data;
                
                // Manejar específicamente el error de datos existentes
                if (apiError?.existingData) {
                    setError('Ya existe un plan de cuentas. No se puede cargar uno nuevo.');
                    setErrorDetails([]);
                } 
                // Manejar errores de validación del archivo
                else if (apiError?.errors) {
                    setErrorDetails(apiError.errors);
                    setError('');
                } 
                // Manejar otros errores
                else {
                    setError(err instanceof Error ? err.message : 'Error al cargar el archivo');
                    setErrorDetails([]); 
                }
            },
        });
    };

    return (
        <Box sx={{ borderRadius: 2, boxShadow: 3, maxWidth: 400, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Cargar Plan de Cuentas
            </Typography>
            <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                style={{ marginBottom: '16px', width: '60%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                style={{ marginLeft: '16px', width: '30%', borderRadius: '4px' }}
            >
                Cargar
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>Datos Existentes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ya existen datos en la tabla. ¿Desea reemplazar los datos existentes con los del Excel?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmReplace} color="primary" autoFocus>
                        Reemplazar
                    </Button>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExcelUpload;