import { useState } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { UsuariosTable } from '@/components/usuario/usuario-table';
import { UsuariosModal } from '@/components/usuario/usuario-modal';
import { useGetUsuario, useDeleteUsuario } from '@/api/user-request';
import { UsuarioResponseType } from '@/api/user-types';

export function GestionUsuarios() {
    const [open, setOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UsuarioResponseType | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

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
    

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ 
            open: true, 
            message, 
            severity 
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleDeleteUser = (userId: number) => {
        deleteUsuario(userId, {
            onSuccess: () => {
                showSnackbar('Usuario eliminado exitosamente');
            },
            onError: (error) => {
                const errorMessage = error instanceof Error ? error.message : 'Error al eliminar usuario';
                showSnackbar(errorMessage, 'error');
            }
        });
    };

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar usuarios</div>;

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
                showSnackbar={showSnackbar}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box> 
    );
}