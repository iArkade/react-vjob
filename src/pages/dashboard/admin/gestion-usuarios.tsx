import React, { useState } from 'react';
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

    // Fetch users query
    const { data: users = [], isLoading, error } = useGetUsuario();

    // Delete mutation
    const { mutate: deleteUsuario } = useDeleteUsuario();

    const handleOpenDialog = (user: UsuarioResponseType | null = null) => {
        setCurrentUser(user);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setCurrentUser(null);
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
                showSnackbar('Error al eliminar usuario', 'error');
                console.error(error);
            }
        });
    };

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar usuarios</div>;

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Usuario
                </Button>
            </Box>

            {/* Table Component */}
            <UsuariosTable 
                users={users} 
                onEdit={handleOpenDialog}
                onDelete={handleDeleteUser}
            />

            {/* Modal Component */}
            <UsuariosModal
                open={open}
                onClose={handleCloseDialog}
                currentUser={currentUser}
            />

            {/* Snackbar for notifications */}
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