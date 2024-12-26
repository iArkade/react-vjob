import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { useCreateEmpresa, useGetEmpresa } from '@/api/empresas/empresa-request';
import { EmpresaRequestType } from '@/api/empresas/empresa-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedEmpresa } from '@/state/slices/empresaSlice';


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
        // <Box sx={{ p: 4 }}>
        //     <Typography variant="h5" gutterBottom>Empresas</Typography>

        //     {/* Combo box */}
        //     <FormControl fullWidth margin="normal">
        //         <Select
        //             value={selectedCompany}
        //             onChange={handleSelectChange}
        //             displayEmpty
        //         >
        //             <MenuItem value="">
        //                 <em>Selecciona una empresa</em>
        //             </MenuItem>
        //             {companies?.map((company) => (
        //                 <MenuItem key={company.codigo} value={company.codigo}>
        //                     {company.nombre}
        //                 </MenuItem>
        //             ))}
        //         </Select>
        //     </FormControl>

        //     {/* Botón para abrir el modal */}
        //     <Button variant="contained" color="primary" onClick={handleOpen}>
        //         Crear Empresa
        //     </Button>

        //     {/* Modal para crear empresa */}
        //     <Dialog
        //         open={open}
        //         onClose={handleClose}
        //         maxWidth="sm"
        //         fullWidth
        //     >
        //         <DialogTitle>
        //             <Typography variant="h6">Crear Empresa</Typography>
        //         </DialogTitle>
        //         <DialogContent>
        //         <TableContainer component={Paper}>
        //                 <Table>
        //                     <TableBody>
        //                         {(['codigo', 'ruc', 'nombre', 'correo', 'telefono', 'direccion', 'logo'] as (keyof EmpresaRequestType)[]).map((field) => (
        //                             <TableRow key={field}>
        //                                 <TableCell sx={{ fontWeight: 'bold' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
        //                                 <TableCell>
        //                                     <TextField
        //                                         fullWidth
        //                                         variant="outlined"
        //                                         name={field}
        //                                         value={formData[field]}
        //                                         onChange={handleInputChange}
        //                                     />
        //                                 </TableCell>
        //                             </TableRow>
        //                         ))}
        //                     </TableBody>
        //                 </Table>
        //             </TableContainer>
        //             <Box display="flex" justifyContent="space-between" mt={2}>
        //                 <Button variant="contained" color="primary" onClick={handleAddCompany}>
        //                     Guardar
        //                 </Button>
        //                 <Button variant="outlined" color="secondary" onClick={handleClose}>
        //                     Cancelar
        //                 </Button>
        //             </Box>
        //         </DialogContent>
        //     </Dialog>
        // </Box>
        <Box sx={{ p: 4 }}>
            <Stack spacing={4}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
                    <Box sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h5">Empresas</Typography>
                    </Box>  
                </Stack>
                <Card>
                    <Box sx={{ overflowX: 'auto' }}>

                        {/* Combo box */}
                        <FormControl fullWidth margin="normal">
                            <Select
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
                    </Box>

                </Card>


            </Stack>


            {/* Botón para abrir el modal */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Crear Empresa
            </Button>

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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {(['codigo', 'ruc', 'nombre', 'correo', 'telefono', 'direccion', 'logo'] as (keyof EmpresaRequestType)[]).map((field) => (
                                    <TableRow key={field}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleAddCompany}>
                            Guardar
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Page;
