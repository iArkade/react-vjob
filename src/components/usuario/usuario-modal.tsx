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
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { UsuarioRequestType, UsuarioResponseType } from '@/api/user-types';
import { useCreateUsuario, useUpdateUsuario } from '@/api/user-request';

interface UsuariosModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: UsuarioResponseType | null;
}

export function UsuariosModal({ 
    open, 
    onClose, 
    currentUser 
}: UsuariosModalProps) {
    const [formData, setFormData] = useState<UsuarioRequestType>({
        name: '',
        email: '',
        role: '',
        lastname: ''
    });
    const [active, setActive] = useState<boolean>(true);

    const { mutate: createUsuario } = useCreateUsuario();
    const { mutate: updateUsuario } = useUpdateUsuario();

    useEffect(() => {
        if (currentUser) {
            setFormData({
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                lastname: currentUser.lastname || ''
            });
            setActive(currentUser.active ?? true);
        } else {
            setFormData({
                name: '',
                email: '',
                role: '',
                lastname: ''
            });
            setActive(true);
        }
    }, [currentUser, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentUser) {
            updateUsuario({ 
                id: currentUser.id, 
                data: formData
            }, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.error('Error updating user:', error);
                }
            });
        } else {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value.toString());
            });
            formDataToSend.append('active', active.toString());

            createUsuario(formDataToSend, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.error('Error creating user:', error);
                }
            });
        }
    };

    const roles: string[] = ['Admin', 'Usuario', 'Editor'];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        name="name"
                        label="Nombre"
                        value={formData.name}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        name="lastname"
                        label="Apellido"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        name="role"
                        label="Rol"
                        select
                        value={formData.role}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    >
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                name="active"
                            />
                        }
                        label="Usuario Activo"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {currentUser ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}