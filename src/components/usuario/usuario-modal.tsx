import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Autocomplete,
    Grid,
    Chip,
    IconButton,
    Paper,
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { UsuarioRequestType, UsuarioResponseType } from '@/api/user-types';
import { useCreateUsuario, useUpdateUsuario } from '@/api/user-request';
import { useGetEmpresa } from '@/api/empresas/empresa-request';

interface UsuariosModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: UsuarioResponseType | null;
    showSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export function UsuariosModal({ open, onClose, currentUser, showSnackbar }: UsuariosModalProps) {
    const [formData, setFormData] = useState<UsuarioRequestType>({
        email: '',
        name: '',
        lastname: '',
        password: '',
        empresas: [],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: empresasDisponibles = [], isLoading } = useGetEmpresa();
    const { mutate: createUsuario, isLoading: isCreating } = useCreateUsuario();
    const { mutate: updateUsuario, isLoading: isUpdating } = useUpdateUsuario();
    useEffect(() => {
        if (currentUser) {
            setFormData({
                email: currentUser.email,
                name: currentUser.name,
                lastname: currentUser.lastname || '',
                password: '',
                empresas: currentUser.empresas ? currentUser.empresas.map(emp => ({
                    empresaId: emp.empresa.id,
                    companyRole: emp.companyRole,
                })) : [],
            });
        } else {
            setFormData({
                email: '',
                name: '',
                lastname: '',
                password: '',
                empresas: [],
            });
        }
        setErrors({});
    }, [currentUser, open]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) newErrors.email = 'El correo es requerido';
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!currentUser && !formData.password) newErrors.password = 'La contraseña es requerida para nuevos usuarios';

        if (formData.empresas.length === 0) {
            newErrors.empresas = 'Debe seleccionar al menos una empresa';
        }

        formData.empresas.forEach((empresa, index) => {
            if (!empresa.companyRole) {
                newErrors[`empresa-${index}`] = 'El rol de empresa es requerido';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Limpiar error del campo cuando se modifica
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleEmpresaChange = (_event: any, selectedEmpresas: any[]) => {
        const updatedEmpresas = selectedEmpresas.map(empresa => {
            // Mantener el rol existente si la empresa ya estaba seleccionada
            const existingEmpresa = formData.empresas.find(e => e.empresaId === empresa.id);
            return {
                empresaId: empresa.id,
                companyRole: existingEmpresa?.companyRole || 'user',
            };
        });

        setFormData(prev => ({
            ...prev,
            empresas: updatedEmpresas,
        }));
    };

    const handleRoleChange = (empresaId: number, role: string) => {
        setFormData(prev => ({
            ...prev,
            empresas: prev.empresas.map(emp =>
                emp.empresaId === empresaId ? { ...emp, companyRole: role } : emp
            ),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            if (currentUser) {
                const updatedData: Partial<UsuarioRequestType> = {
                    empresas: formData.empresas,
                };

                if (formData.password) {
                    updatedData.password = formData.password;
                }

                if (formData.email !== currentUser.email) {
                    updatedData.email = formData.email;
                }
                if (formData.name !== currentUser.name) {
                    updatedData.name = formData.name;
                }
                if (formData.lastname !== currentUser.lastname) {
                    updatedData.lastname = formData.lastname;
                }

                await updateUsuario({ id: currentUser.id, data: updatedData }, {
                    onSuccess: () => {
                        showSnackbar('Usuario actualizado exitosamente', 'success');
                        onClose();
                    },
                    onError: (error) => {
                        const errorMessage = error instanceof Error ? error.message : 'Error al actualizar usuario';
                        showSnackbar(errorMessage, 'error');
                    }
                });
            } else {
                if (!validateForm()) return;

                await createUsuario(formData, {
                    onSuccess: () => {
                        showSnackbar('Usuario creado exitosamente', 'success');
                        onClose();
                    },
                    onError: (error) => {
                        const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
                        showSnackbar(errorMessage, 'error');
                    }
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            showSnackbar(errorMessage, 'error');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 3,
                }
            }}
        >
            <DialogTitle sx={{
                pb: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}>
                <Typography variant="h5" component="span">
                    {currentUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        {/* Información básica */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Información básica
                            </Typography>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Correo electrónico"
                                            fullWidth
                                            required
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Contraseña"
                                            fullWidth
                                            required={!currentUser}
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password || (currentUser ? 'Dejar en blanco para mantener la actual' : '')}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Nombre"
                                            fullWidth
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Apellido"
                                            fullWidth
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Asignación de empresas */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                                Asignación de empresas
                            </Typography>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            multiple
                                            options={empresasDisponibles}
                                            getOptionLabel={(option) => option.nombre}
                                            value={empresasDisponibles.filter(emp =>
                                                formData.empresas.some(e => e.empresaId === emp.id)
                                            )}
                                            onChange={handleEmpresaChange}
                                            disabled={isSubmitting}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Seleccionar empresas"
                                                    placeholder="Buscar empresa..."
                                                    error={!!errors.empresas}
                                                    helperText={errors.empresas || ''}
                                                />
                                            )}
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => {
                                                    const { key, ...otherProps } = getTagProps({ index });
                                                    return (
                                                        <Chip
                                                            key={key}
                                                            label={option.nombre}
                                                            {...otherProps}
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    );
                                                })
                                            }
                                        />
                                    </Grid>
                                    {formData.empresas.map((empresa, index) => {
                                        if (!empresa.empresaId) return null;
                                        const empresaInfo = empresasDisponibles.find(e => e.id === empresa.empresaId);
                                        return (
                                            <Grid item xs={12} key={empresa.empresaId}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: 'background.paper',
                                                        border: 1,
                                                        borderColor: 'divider'
                                                    }}
                                                >
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs>
                                                            <Typography variant="subtitle2">
                                                                {empresaInfo?.nombre}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                select
                                                                fullWidth
                                                                size="small"
                                                                label="Rol en la empresa"
                                                                value={empresa.companyRole}
                                                                onChange={(e) => handleRoleChange(empresa.empresaId, e.target.value)}
                                                                error={!!errors[`empresa-${index}`]}
                                                                helperText={errors[`empresa-${index}`]}
                                                                disabled={isSubmitting}
                                                            >
                                                                <MenuItem value="admin">Administrador</MenuItem>
                                                                <MenuItem value="user">Usuario</MenuItem>
                                                            </TextField>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                >
                    {currentUser ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}