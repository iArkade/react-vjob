import React, { useState } from 'react';
import { useUploadExcel } from '@/api/accounting_plan/accountRequest';
import { Box, Button, Typography, Alert } from '@mui/material';

const ExcelUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
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
            onSuccess: () => {
                setSuccessMessage('File uploaded successfully!');
                setFile(null);
            },
            onError: (err: unknown) => {
                setError(err instanceof Error ? err.message : 'Error uploading file');
            },
        });
    };

    return (
        <Box  
            sx={{ borderRadius: 2, boxShadow: 3, maxWidth: 400, mt: 3 }}
        >
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
                Upload
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        </Box>
    );
};

export default ExcelUpload;
