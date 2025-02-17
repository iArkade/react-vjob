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
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

interface ExcelUploadProps {
    onSuccessfulUpload?: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onSuccessfulUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorDetails, setErrorDetails] = useState<string[]>([]);
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
    const empresa_id = selectedEmpresa.id;

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

    const handleUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado
    
        if (!file) {
            setError('Por favor, seleccione un archivo para cargar.');
            clearMessages(5000); // Limpia los mensajes después de 5s
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        uploadExcelMutation.mutate(
            { formData, empresa_id },
            {
                onSuccess: () => {
                    setSuccessMessage('Archivo cargado exitosamente!');
                    setFile(null);
                    setErrorDetails([]);
                    onSuccessfulUpload?.();
                    clearMessages(5000); // Mensaje de éxito desaparece en 5s
                },
                onError: (err: any) => {
                    const apiError = err?.response?.data;
    
                    if (apiError?.existingData) {
                        setError('Ya existe un plan de cuentas. No se puede cargar uno nuevo.');
                        setErrorDetails([]);
                    } else if (apiError?.errors) {
                        setErrorDetails(apiError.errors);
                        setError('');
                    } else {
                        setError(err instanceof Error ? err.message : 'Error al cargar el archivo');
                        setErrorDetails([]);
                    }
                    clearMessages(5000); // Mensaje de error desaparece en 5s
                },
            }
        );
    };
    

    const clearMessages = (timeout: number = 0) => {
        setTimeout(() => {
            setError('');
            setSuccessMessage('');
        }, timeout);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Cargar Plan de Cuentas
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={handleFileChange}
                            style={{
                                marginRight: '16px',
                                width: '60%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                            sx={{ 
                                width: '30%', 
                                borderRadius: '4px',
                                height: '40px'
                            }}
                        >
                            Cargar
                        </Button>
                    </Box>
                    
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
                </Grid>
                
                {errorDetails.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Box 
                            sx={{ 
                                border: '1px solid #ff0000', 
                                borderRadius: 2, 
                                p: 2, 
                                bgcolor: '#ffebee' 
                            }}
                        >
                            <Typography variant="subtitle1" color="error" sx={{ mb: 1 }}>
                                Errores Detallados:
                            </Typography>
                            <List dense>
                                {errorDetails.map((detail, index) => (
                                    <ListItem key={index} disableGutters>
                                        <ListItemText 
                                            primary={detail} 
                                            primaryTypographyProps={{ 
                                                color: 'error', 
                                                variant: 'body2' 
                                            }} 
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ExcelUpload;
