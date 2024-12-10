import React, { useState } from 'react';
import { useUploadExcel } from '@/api/accounting-plan/account-request';
import { Box, Button, Typography, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ExcelUploadProps {
    onSuccessfulUpload?: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onSuccessfulUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const uploadExcelMutation = useUploadExcel();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile && selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setError('Please upload a valid Excel file (xlsx).');
            setFile(null);
        } else {
            setError('');
            setFile(selectedFile);
        }
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        uploadExcelMutation.mutate(formData, {
            onSuccess: (response: any) => {
                if (response.existingData) {
                    setOpenConfirmDialog(true);
                } else {
                    setSuccessMessage('File uploaded successfully!');
                    setFile(null);
                }
            },
            onError: (err: unknown) => {
                setError(err instanceof Error ? err.message : 'Error uploading file');
            },
        });
    };
    const handleConfirmReplace = () => {
        const formData = new FormData();
        formData.append('file', file!);
        formData.append('replace', 'true');

        uploadExcelMutation.mutate(formData, {
            onSuccess: () => {
            onSuccessfulUpload?.(); // Trigger refresh
            setSuccessMessage('File uploaded and data replaced successfully!');
            setFile(null);
            setOpenConfirmDialog(false);
            },
            onError: (err: unknown) => {
            setError(err instanceof Error ? err.message : 'Error uploading file');
            setOpenConfirmDialog(false);
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