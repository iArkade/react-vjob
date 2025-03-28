import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { UsuariosTable } from '@/components/usuario/usuario-table';
import { UsuariosModal } from '@/components/usuario/usuario-modal';
import { useGetUsuario, useDeleteUsuario } from '@/api/user-request';
import { UsuarioResponseType } from '@/api/user-types';
import { useDispatch } from 'react-redux';
import { setFeedback } from '@/state/slices/feedBackSlice';

export function GestionUsuarios() {
    const [open, setOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UsuarioResponseType | null>(null);

    const dispatch = useDispatch();

    const { data: users = [], isLoading, error } = useGetUsuario();
    const { mutate: deleteUsuario } = useDeleteUsuario();

    const handleOpenDialog = (user: UsuarioResponseType | null = null) => {
        setCurrentUser(user);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setCurrentUser(null);

        // Mueve el foco al botón "Nuevo Usuario" cuando el modal se cierra
        setTimeout(() => {
            document.getElementById('open-user-modal-btn')?.focus();
        }, 0);
    };

    const handleDeleteUser = (userId: number) => {
        deleteUsuario(userId, {
            onSuccess: () => {
                dispatch(setFeedback({ message: 'Usuario eliminado exitosamente', severity: 'success', isError: false }));
            },
            onError: (error) => {
                const errorMessage = error instanceof Error ? error.message : 'Error al eliminar usuario';
                dispatch(setFeedback({ message: errorMessage, severity: 'error', isError: true }));
            }
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
                <Typography sx={{ ml: 1 }}>Cargando...</Typography>

            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error al cargar usuarios</Alert>;
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    id="open-user-modal-btn"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Usuario
                </Button>
            </Box>

            <UsuariosTable
                users={users}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteUser}
            />

            <UsuariosModal
                open={open}
                onClose={handleCloseDialog}
                currentUser={currentUser}
                showSnackbar={(message, severity = 'success') =>
                    dispatch(setFeedback({ message, severity, isError: severity === 'error' }))
                }
            />
        </Box>
    );
}