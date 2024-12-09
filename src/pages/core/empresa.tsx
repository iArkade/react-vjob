import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { useCreateEmpresa, useGetEmpresa } from '@/api/empresas/empresa-request';
import { EmpresaRequestType } from '@/api/empresas/empresa-types';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export function Page(): React.JSX.Element {
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

    // Hook para crear una nueva empresa
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
        setSelectedCompany(event.target.value);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Empresas</Typography>

            {/* Combo box */}
            <FormControl fullWidth margin="normal">
                <Select
                    labelId="company-select-label"
                    id="company-select"
                    value={selectedCompany}
                    onChange={handleSelectChange}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Selecciona una empresa</em>
                    </MenuItem>
                    {companies?.map((company) => (
                        <MenuItem key={company.codigo} value={company.codigo}>
                            {company.nombre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Botón para abrir el modal */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Crear Empresa
            </Button>

            {/* Modal para crear empresa */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Crear Empresa
                    </Typography>
                    {['codigo', 'ruc', 'nombre', 'correo', 'telefono', 'direccion', 'logo'].map((field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            fullWidth
                            value={(formData as any)[field]}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                    ))}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleAddCompany}>
                            Guardar
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Page;
