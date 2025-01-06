import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { useCreateEmpresa, useGetEmpresa } from '@/api/empresas/empresa-request';
import { EmpresaRequestType } from '@/api/empresas/empresa-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedEmpresa } from '@/state/slices/empresaSlice';
import { Option } from '@/components/core/option';


export function Page(): React.JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<EmpresaRequestType>({
        codigo: '',
        ruc: '',
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        logo: ''
    });
    const [selectedCompany, setSelectedCompany] = useState<string>('');

    // Obtener la lista de empresas desde el backend
    const { data: companies, refetch } = useGetEmpresa();

    // Hook para crear una nuva empresa
    const createEmpresaMutation = useCreateEmpresa();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCompany = async () => {
        if (formData.nombre.trim()) {
            try {
                await createEmpresaMutation.mutateAsync(formData);
                refetch(); // Refrescar la lista de empresas
                setFormData({
                    codigo: '',
                    ruc: '',
                    nombre: '',
                    correo: '',
                    telefono: '',
                    direccion: '',
                    logo: ''
                });
                handleClose();
            } catch (error) {
                console.error('Error al crear la empresa:', error);
            }
        }
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const selectedCodigo = event.target.value;
        setSelectedCompany(selectedCodigo);

        if (selectedCodigo) {
            const selectedEmpresa = companies?.find((company) => company.codigo === selectedCodigo);

            // Check if selectedEmpresa exists before dispatching
            if (selectedEmpresa) {
                dispatch(setSelectedEmpresa(selectedEmpresa));
                navigate(`/dashboard`, { state: { empresa: selectedEmpresa } });
            } else {
                // Optional: Handle case where no company is found
                console.error('No company found with the selected code');
            }
        }
    };

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Empresas</Typography>
            <Card sx={{ p: 2, minWidth: 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl fullWidth sx={{ flex: 1, mr: 2 }}>
                    <Select
                        value={selectedCompany}
                        onChange={handleSelectChange}
                        displayEmpty
                        size="small"
                    >
                        <Option value="">
                            <em>Selecciona una empresa</em>
                        </Option>
                        {companies?.map((company) => (
                            <Option key={company.codigo} value={company.codigo}>
                                {company.nombre}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                >
                    Crear Empresa
                </Button>
            </Card>

            {/* Modal para crear empresa */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6">Crear Empresa</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Codigo"
                            variant="outlined"
                            fullWidth
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            label="Ruc"
                            variant="outlined"
                            fullWidth
                            name="ruc"
                            value={formData.ruc}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            label="Correo"
                            variant="outlined"
                            fullWidth
                            name="correo"
                            value={formData.correo}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            label="Telefono"
                            variant="outlined"
                            fullWidth
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <TextField
                            label="Direccion"
                            variant="outlined"
                            fullWidth
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            size="small"
                        />
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Logo
                            </Typography>
                            <input
                                accept="image/*"
                                type="file"
                                //onChange={(e) => handleFileUpload(e)}
                                style={{ display: 'block', width: '100%' }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button variant="outlined" color="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleAddCompany}>
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Page;
