import React from 'react';
import { Button, Typography, Alert, Box, Divider, Stack, Card, CircularProgress } from '@mui/material';
import EmpresaTable from '@/components/empresa/empresa-table';
import EmpresaModal from '@/components/empresa/empresa-modal';
import {
    useGetEmpresa,
    useCreateEmpresa,
    useUpdateEmpresa,
    useDeleteEmpresa
} from '@/api/empresas/empresa-request';
import { EmpresaResponseType, EmpresaRequestType } from '@/api/empresas/empresa-types';
import { useDispatch } from 'react-redux';
import { setFeedback } from '@/state/slices/feedBackSlice';


const GestionEmpresas: React.FC = () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = React.useState<EmpresaResponseType | null>(null);

    const dispatch = useDispatch();

    // Fetch empresas
    const { data: empresas = [], isLoading, error } = useGetEmpresa();

    //console.log(empresas);


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
                        dispatch(setFeedback({ message: 'Empresa actualizada correctamente', severity: 'success', isError: false }));
                    },
                    onError: () => {
                        dispatch(setFeedback({ message: 'Error al actualizar empresa', severity: 'error', isError: true }));
                    },
                }
            );
        } else {
            // Create new empresa
            createEmpresa.mutate(formData, {
                onSuccess: () => {
                    dispatch(setFeedback({ message: 'Empresa creada correctamente', severity: 'success', isError: false }));
                },
                onError: () => {
                    dispatch(setFeedback({ message: 'Error al crear empresa', severity: 'error', isError: true }));
                },
            });
        }

        setModalOpen(false);
    };

    const handleDeleteEmpresa = (id: number) => {
        deleteEmpresa.mutate(id, {
            onSuccess: () => {
                dispatch(setFeedback({ message: 'Empresa eliminada correctamente', severity: 'success', isError: false }));
            },
            onError: () => {
                dispatch(setFeedback({ message: 'Error al eliminar empresa', severity: 'error', isError: true }));
            },
        });
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <CircularProgress />
            </Box>
        );
    }


    if (error) return <Alert severity="error">Error al cargar empresas</Alert>;

    return (
        <React.Fragment>
            <Box
                sx={{
                    maxWidth: "var(--Content-maxWidth)",
                    m: "var(--Content-margin)",
                    p: "var(--Content-padding)",
                    width: "var(--Content-width)",
                }}
            >
                <Stack spacing={4}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        sx={{ alignItems: "flex-start" }}
                    >
                        <Box sx={{ flex: "1 1 auto" }}>
                            <Typography variant="h4">Gestión de Empresas</Typography>
                        </Box>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOpenModal()}
                            >
                                Agregar Empresa
                            </Button>
                        </div>
                    </Stack>
                    <Card>
                        <Box sx={{ overflowX: "auto" }}>
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
                        </Box>
                        <Divider />
                    </Card>
                </Stack>
            </Box>
        </React.Fragment>
    );
};

export default GestionEmpresas;
