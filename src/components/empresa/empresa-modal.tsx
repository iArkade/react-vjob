// import React from 'react';
// import {
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     TextField,
//     Button,
//     Input,
//     FormControl,
//     InputLabel,
//     Box,
//     Typography,
//     Avatar
// } from '@mui/material';
// import { EmpresaRequestType, EmpresaResponseType } from '@/api/empresas/empresa-types';

// interface EmpresaModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSave: (empresa: EmpresaRequestType) => void;
//     empresa: EmpresaResponseType | null;
// }

// const EmpresaModal: React.FC<EmpresaModalProps> = ({ open, onClose, onSave, empresa }) => {
//     const [formData, setFormData] = React.useState<EmpresaRequestType>({
//         codigo: empresa?.codigo || '',
//         ruc: empresa?.ruc || '',
//         nombre: empresa?.nombre || '',
//         correo: empresa?.correo || '',
//         telefono: empresa?.telefono || '',
//         direccion: empresa?.direccion || '',
//         logo: null,
//         ...(empresa?.id ? { id: empresa.id } : {})
//     });

//     const [logoPreview, setLogoPreview] = React.useState<string | null>(empresa?.logo || null);

//     React.useEffect(() => {
//         if (empresa) {
//             setFormData({
//                 codigo: empresa.codigo,
//                 ruc: empresa.ruc,
//                 nombre: empresa.nombre,
//                 correo: empresa.correo,
//                 telefono: empresa.telefono,
//                 direccion: empresa.direccion,
//                 logo: null,
//                 ...(empresa.id ? { id: empresa.id } : {})
//             }); 
//             setLogoPreview(empresa.logo || null);
//         } else {
//             setFormData({
//                 codigo: '',
//                 ruc: '',
//                 nombre: '',
//                 correo: '',
//                 telefono: '',
//                 direccion: '',
//                 logo: null,
//             });
//             setLogoPreview(null);
//         }
//     }, [empresa]);

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = event.target;
//         setFormData((current) => ({ ...current, [name]: value }));
//     };

//     const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (files && files.length > 0) {
//             const file = files[0];
//             setFormData((current) => ({ ...current, logo: file }));
//             setLogoPreview(URL.createObjectURL(file));
//         }
//     };

//     const handleSubmit = () => {
//         onSave(formData);
//     };

//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle>{empresa ? 'Editar Empresa' : 'Agregar Empresa'}</DialogTitle>
//             <DialogContent>
//                 <Box sx={{ mt: 2 }}>
//                     <TextField
//                         label="Código"
//                         name="codigo"
//                         fullWidth
//                         margin="normal"
//                         value={formData.codigo}
//                         onChange={handleChange}
//                         required
//                     />
//                     <TextField
//                         label="RUC"
//                         name="ruc"
//                         fullWidth
//                         margin="normal"
//                         value={formData.ruc}
//                         onChange={handleChange}
//                         required
//                     />
//                     <TextField
//                         label="Nombre"
//                         name="nombre"
//                         fullWidth
//                         margin="normal"
//                         value={formData.nombre}
//                         onChange={handleChange}
//                         required
//                     />
//                     <TextField
//                         label="Correo"
//                         name="correo"
//                         fullWidth
//                         margin="normal"
//                         value={formData.correo}
//                         onChange={handleChange}
//                         type="email"
//                     />
//                     <TextField
//                         label="Teléfono"
//                         name="telefono"
//                         fullWidth
//                         margin="normal"
//                         value={formData.telefono}
//                         onChange={handleChange}
//                     />
//                     <TextField
//                         label="Dirección"
//                         name="direccion"
//                         fullWidth
//                         margin="normal"
//                         value={formData.direccion}
//                         onChange={handleChange}
//                     />
//                     <FormControl fullWidth margin="normal">
//                         <InputLabel>Logo</InputLabel>
//                         <Input
//                             type="file"
//                             onChange={handleLogoChange}
//                             inputProps={{ accept: 'image/*' }}
//                         />
//                     </FormControl>
//                     {logoPreview && (
//                         <Box sx={{ mt: 2, textAlign: 'center' }}>
//                             <Typography variant="subtitle1">Vista previa del logo:</Typography>
//                             <Avatar src={logoPreview} sx={{ width: 100, height: 100, mx: 'auto' }} />
//                         </Box>
//                     )}
//                 </Box>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="secondary">Cancelar</Button>
//                 <Button onClick={handleSubmit} color="primary">Guardar</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default React.memo(EmpresaModal);

import React from 'react';
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
    FormHelperText
} from '@mui/material';
import { EmpresaRequestType, EmpresaResponseType } from '@/api/empresas/empresa-types';
import { useForm } from 'react-hook-form';
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';

interface EmpresaModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (empresa: EmpresaRequestType) => void;
    empresa: EmpresaResponseType | null;
}

const EmpresaModal: React.FC<EmpresaModalProps> = ({
    open,
    onClose,
    onSave,
    empresa
}) => {

    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [newImageFile, setNewImageFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const {
        handleSubmit,
        reset,
        register,
        setValue,
        formState: { errors },
        watch,
    } = useForm<EmpresaRequestType>();

    //Actualiza los valores del modal cuando empresa cambia
    React.useEffect(() => {
        if (empresa) {
            //console.log('Cargando datos de la empresa en el formulario:', empresa);
            reset({
                codigo: empresa.codigo || '',
                ruc: empresa.ruc || '',
                nombre: empresa.nombre || '',
                correo: empresa.correo || '',
                telefono: empresa.telefono || '',
                direccion: empresa.direccion || '',
                logo: null,
                ...(empresa.id ? { id: empresa.id } : {}),
            });
            setSelectedImage(empresa.logo || null); // Cargar imagen si existe
            setNewImageFile(null);
        } else {
            reset({
                codigo: '',
                ruc: '',
                nombre: '',
                correo: '',
                telefono: '',
                direccion: '',
                logo: null,
            });
            setSelectedImage(null);
            setNewImageFile(null);
        }
    }, [empresa, reset]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            setValue('logo', file);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setSelectedImage(reader.result as string); // Convertimos la imagen a base64
                }
            };
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
        // Only use the File object or null for the logo property
        const submitData: EmpresaRequestType = {
            ...data,
            logo: newImageFile // This will be File | null
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
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
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
                                            color: 'var(--mui-palette-common-white)',
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
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                            <CameraIcon fontSize="var(--icon-fontSize-md)" />
                                            <Typography color="inherit" variant="subtitle2">
                                                Select
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <Avatar src={selectedImage || ''} sx={{ '--Avatar-size': '100px' }} />
                                    {/* <Avatar src={selectedImage || '/assets/avatar.png'} sx={{ '--Avatar-size': '100px' }} /> */}
                                </Box>
                            </Box>
                            <Button color="secondary" size="small" onClick={handleRemoveImage}>
                                Remove
                            </Button>

                            {/* Input de archivo oculto */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageSelect}
                            />
                        </Stack>
                        <Stack spacing={2}>
                            {/* Código */}
                            <TextField
                                label="Código"
                                placeholder="Ingrese el código"
                                {...register('codigo', { required: 'El código es obligatorio.' })}
                                fullWidth
                                size="small"
                                error={!!errors.codigo}
                                helperText={errors.codigo?.message}
                            />

                            {/* RUC */}
                            <TextField
                                label="RUC"
                                placeholder="Ingrese el RUC (13 dígitos)"
                                {...register('ruc', {
                                    validate: {
                                        isNotEmpty: (value) => value.trim() !== '' || 'El RUC es obligatorio.',
                                        isExactLength: (value) => value.length === 13 || 'El RUC debe tener 13 dígitos.',
                                    },
                                })}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                                    setValue('ruc', value, { shouldValidate: true });
                                }}
                                fullWidth
                                size="small"
                                error={!!errors.ruc}
                                helperText={errors.ruc?.message}
                            />

                            {/* Nombre */}
                            <TextField
                                label="Nombre"
                                placeholder="Ingrese el nombre"
                                {...register('nombre', { required: 'El nombre es obligatorio.' })}
                                fullWidth
                                size="small"
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                            />

                            {/* Correo */}
                            <TextField
                                label="Correo"
                                placeholder="Ingrese el correo electrónico"
                                {...register('correo', {
                                    required: 'El correo es obligatorio.',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'El correo no tiene un formato válido.',
                                    },
                                })}
                                fullWidth
                                size="small"
                                error={!!errors.correo}
                                helperText={errors.correo?.message}
                            />

                            {/* Teléfono */}
                            <TextField
                                label="Teléfono"
                                placeholder="Ingrese el teléfono (10 dígitos)"
                                {...register('telefono', {
                                    validate: {
                                        isExactLength: (value) => value.length === 10 || 'El teléfono debe tener 10 dígitos.',
                                    },
                                })}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                    setValue('telefono', value, { shouldValidate: true });
                                }}
                                fullWidth
                                size="small"
                                error={!!errors.telefono}
                                helperText={errors.telefono?.message}
                            />

                            {/* Dirección */}
                            <FormControl fullWidth size="small" error={!!errors.direccion}>
                                <InputLabel htmlFor="direccion">Dirección</InputLabel>
                                <OutlinedInput
                                    {...register('direccion', {
                                        maxLength: {
                                            value: 200,
                                            message: 'La dirección no puede exceder los 200 caracteres.',
                                        },
                                    })}
                                    id="direccion"
                                    multiline
                                    rows={3}
                                    placeholder="Ingrese la dirección..."
                                    value={watch('direccion') || ''} // Vincula el valor con react-hook-form
                                    onChange={(e) => {
                                        const value = e.target.value.slice(0, 200); // Corta si excede 200 caracteres
                                        setValue('direccion', value, { shouldValidate: true }); // Actualiza con validación
                                    }}
                                />
                                <FormHelperText error={!!errors.direccion}>
                                    {errors.direccion?.message || `${watch('direccion')?.length || 0}/200 caracteres`}
                                </FormHelperText>
                            </FormControl>
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