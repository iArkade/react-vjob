import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Box,
    Typography,
    IconButton,
    Stack,
    Avatar,
    OutlinedInput,
    FormHelperText,
} from '@mui/material';
import { EmpresaRequestType, EmpresaResponseType } from '@/api/empresas/empresa-types';
import { Controller, useForm } from 'react-hook-form';
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';

interface EmpresaModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (empresa: EmpresaRequestType) => void;
    empresa: EmpresaResponseType | null;
}

const EmpresaModal: React.FC<EmpresaModalProps> = ({ open, onClose, onSave, empresa }) => {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors },
    } = useForm<EmpresaRequestType>({
        mode: 'onChange', // Mostrar errores mientras escribe
    });

    useEffect(() => {
        if (open) {
            reset({
                codigo: empresa?.codigo || '',
                ruc: empresa?.ruc || '',
                nombre: empresa?.nombre || '',
                correo: empresa?.correo || '',
                telefono: empresa?.telefono || '',
                direccion: empresa?.direccion || '',
                logo: null,
                id: empresa?.id ?? undefined,
            });
            setSelectedImage(empresa?.logo || null);
            setNewImageFile(null);
        }
    }, [open, empresa, reset]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            setValue('logo', file);
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setNewImageFile(null);
        setValue('logo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelectClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = (data: EmpresaRequestType) => {
        const submitData: EmpresaRequestType = {
            ...data,
            logo: newImageFile,
        };
        onSave(submitData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{empresa ? 'Editar Empresa' : 'Agregar Empresa'}</Typography>
                    <IconButton onClick={onClose}>
                        <XIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    border: '1px dashed var(--mui-palette-divider)',
                                    borderRadius: '50%',
                                    display: 'inline-flex',
                                    p: '4px',
                                }}
                            >
                                <Box sx={{ borderRadius: 'inherit', position: 'relative' }}>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                            borderRadius: 'inherit',
                                            bottom: 0,
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            left: 0,
                                            opacity: 0,
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            zIndex: 1,
                                            '&:hover': { opacity: 1 },
                                        }}
                                        onClick={handleSelectClick}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CameraIcon fontSize="var(--icon-fontSize-md)" />
                                            <Typography color="inherit" variant="subtitle2">LOGO</Typography>
                                        </Stack>
                                    </Box>
                                    <Avatar src={selectedImage || ''} sx={{ '--Avatar-size': '100px' }} />
                                </Box>
                            </Box>
                            <Button color="secondary" size="small" onClick={handleRemoveImage}>
                                Eliminar
                            </Button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageSelect}
                            />
                        </Stack>

                        <Stack spacing={2}>
                            <Controller
                                name="codigo"
                                control={control}
                                rules={{ required: 'El código es obligatorio.' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Código" fullWidth size="small" error={!!errors.codigo} helperText={errors.codigo?.message} />
                                )}
                            />

                            <Controller
                                name="ruc"
                                control={control}
                                rules={{
                                    required: 'El RUC es obligatorio.',
                                    validate: {
                                        length: (value) => value.length === 13 || 'Debe tener 13 dígitos.',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="RUC"
                                        fullWidth
                                        size="small"
                                        error={!!errors.ruc}
                                        helperText={errors.ruc?.message}
                                        onChange={(e) => field.onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
                                    />
                                )}
                            />

                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: 'El nombre es obligatorio.' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Nombre" fullWidth size="small" error={!!errors.nombre} helperText={errors.nombre?.message} />
                                )}
                            />

                            <Controller
                                name="correo"
                                control={control}
                                rules={{
                                    required: 'El correo es obligatorio.',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'El correo no tiene un formato válido.',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField {...field} label="Correo" fullWidth size="small" error={!!errors.correo} helperText={errors.correo?.message} />
                                )}
                            />

                            <Controller
                                name="telefono"
                                control={control}
                                rules={{
                                    validate: {
                                        length: (value) => value.length === 7 || 'Debe tener 7 dígitos.',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Teléfono"
                                        fullWidth
                                        size="small"
                                        error={!!errors.telefono}
                                        helperText={errors.telefono?.message}
                                        onChange={(e) => field.onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                    />
                                )}
                            />

                            <Controller
                                name="direccion"
                                control={control}
                                rules={{ maxLength: { value: 200, message: 'Máximo 200 caracteres.' } }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.direccion}>
                                        <InputLabel>Dirección</InputLabel>
                                        <OutlinedInput {...field} multiline rows={3} />
                                        <FormHelperText>{errors.direccion?.message || `${field.value?.length || 0}/200 caracteres`}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained">Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EmpresaModal;
