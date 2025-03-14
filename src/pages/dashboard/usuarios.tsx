import React, { useState } from 'react';
import {
    Paper,
    Button,
    TextField,
    Typography,
    Box,
    Toolbar,
    InputAdornment,
    Alert,
    Snackbar,
    AlertColor,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { UsuarioRequestType, UsuarioResponseType } from '@/api/user-types';
import { useCreateUsuarioByEmpresa, useGetUsuariosByEmpresa, useUpdateUsuarioByEmpresa } from '@/api/user-request';
import { useParams } from 'react-router-dom';
import { UsuarioTable } from '@/components/dashboard/usuarios/usuarios-table';
import { useDispatch } from 'react-redux';
import { setFeedback } from '@/state/slices/feedBackSlice';
import { useQueryClient } from 'react-query';
import { UsuarioModal } from '@/components/dashboard/usuarios/usuarios-modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';



interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

export function Usuarios(): React.JSX.Element {

    const queryClient = useQueryClient();

    const [open, setOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UsuarioResponseType | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { empresaId } = useParams<{ empresaId: string }>();


    const user = useSelector((state: RootState) => state.authSlice.user) || {
        id: 0,
        systemRole: '',
        empresas: [] as { role: string }[]
    };
    // Si el usuario existe pero systemRole es undefined, le asignamos un valor por defecto
    const formattedUser = {
        ...user,
        systemRole: user.systemRole || '',  // Garantiza que siempre sea un string
    };

    
    const { data: users = [], isLoading, error } = useGetUsuariosByEmpresa(Number(empresaId));
    const { mutateAsync: createUsuarioByEmpresa } = useCreateUsuarioByEmpresa();
    const { mutateAsync: updateUsuarioByEmpresa } = useUpdateUsuarioByEmpresa();

    //console.log(users, user)

    //Estado para el snackbar
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleOpenDialog = (user?: UsuarioResponseType) => {
        setCurrentUser(user || null);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setCurrentUser(null);
    };


    const onSubmit = async (data: UsuarioRequestType) => {
        try {
            if (!empresaId) {
                showSnackbar("Error: No se encontró la empresa", "error");
                return;
            }

            if (currentUser) {
                console.log(data)
                // Si el usuario ya existe, actualiza
                await updateUsuarioByEmpresa({ empresaId: Number(empresaId), userId: currentUser.id, data });
                showSnackbar("Usuario actualizado con éxito", "success");
            } else {
                // Si es un nuevo usuario, crea
                await createUsuarioByEmpresa({ empresaId: Number(empresaId), data });
                showSnackbar("Usuario creado con éxito", "success");
            }

            await queryClient.invalidateQueries({ queryKey: ['GetUsuariosByEmpresa', Number(empresaId)] });

            handleCloseDialog();
        } catch (error: any) {
            console.error(error);
            let mensajeError = error.mensaje || "Ocurrió un error desconocido."; // Usa un mensaje predeterminado si no hay mensaje
            showSnackbar(mensajeError, "error");
        }
    };

    const handleDeleteUser = (id: number) => {
        // deleteUsuario.mutate(id, {
        //     onSuccess: () => showSnackbar('Usuario eliminado', 'success'),
        //     onError: () => showSnackbar('Error al eliminar el usuario', 'error')
        // });
    };

    const showSnackbar = (message: string, severity: AlertColor): void => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (): void => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar usuarios</div>;

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3, mt: 2 }}>
            <Paper elevation={3}>
                <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Gestión de Usuarios
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Buscar usuarios..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ mr: 2 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Nuevo Usuario
                    </Button>
                </Toolbar>

                <UsuarioTable
                    users={users}
                    searchTerm={searchTerm}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteUser}
                    user={formattedUser}
                />
            </Paper>

            <UsuarioModal
                open={open}
                onClose={handleCloseDialog}
                onSubmit={onSubmit}
                currentUser={currentUser}
                empresaId={Number(empresaId)}
                user={formattedUser}
            />

            {/* Snackbar para notificaciones */}
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
};