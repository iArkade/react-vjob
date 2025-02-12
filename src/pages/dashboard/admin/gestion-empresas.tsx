import React from 'react';
import { Button, Container, Typography, Alert, Box, Snackbar } from '@mui/material';
import EmpresaTable from '@/components/empresa/empresa-table';
import EmpresaModal from '@/components/empresa/empresa-modal';
import {
    useGetEmpresa,
    useCreateEmpresa,
    useUpdateEmpresa,
    useDeleteEmpresa
} from '@/api/empresas/empresa-request';
import { EmpresaResponseType, EmpresaRequestType } from '@/api/empresas/empresa-types';
import { AlertColor } from '@mui/material/Alert';

const GestionEmpresas: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = React.useState<EmpresaResponseType | null>(null);
    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: AlertColor }>(
        { open: false, message: '', severity: 'success' }
    );

    // Fetch empresas
    const { data: empresas = [], isLoading, error } = useGetEmpresa();

    // Mutation hooks
    const createEmpresa = useCreateEmpresa();
    const updateEmpresa = useUpdateEmpresa();
    const deleteEmpresa = useDeleteEmpresa();

    const handleOpenModal = (empresa?: EmpresaResponseType) => {
        setSelectedEmpresa(empresa || null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveEmpresa = (empresa: EmpresaRequestType) => {
        const formData = new FormData();

        // Append all text fields
        Object.keys(empresa).forEach(key => {
            if (key !== 'logo' && key !== 'id') {
                formData.append(key, empresa[key as keyof EmpresaRequestType] as string);
            }
        });

        // Append logo if exists
        if (empresa.logo) {
            formData.append('logo', empresa.logo);
        }

        if (empresa.id) {
            // Update existing empresa
            updateEmpresa.mutate(
                { id: empresa.id, data: formData as unknown as EmpresaRequestType },
                {
                    onSuccess: () => {
                        setSnackbar({ open: true, message: 'Empresa actualizada correctamente', severity: 'success' });
                    },
                    onError: () => {
                        setSnackbar({ open: true, message: 'Error al actualizar empresa', severity: 'error' });
                    },
                }
            );
        } else {
            // Create new empresa
            createEmpresa.mutate(formData, {
                onSuccess: () => {
                    setSnackbar({ open: true, message: 'Empresa creada correctamente', severity: 'success' });
                },
                onError: () => {
                    setSnackbar({ open: true, message: 'Error al crear empresa', severity: 'error' });
                },
            });
        }

        setModalOpen(false);
    };

    const handleDeleteEmpresa = (id: number) => {
        deleteEmpresa.mutate(id, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'Empresa eliminada correctamente', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'Error al eliminar empresa', severity: 'error' });
            },
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    if (isLoading) return <Typography>Cargando...</Typography>;
    if (error) return <Alert severity="error">Error al cargar empresas</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>Gestión de Empresas</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal()}
                    sx={{ mb: 3 }}
                >
                    Agregar Empresa
                </Button>
                <EmpresaTable
                    empresas={empresas}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteEmpresa}
                />
                <EmpresaModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveEmpresa}
                    empresa={selectedEmpresa}
                />
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default GestionEmpresas;
