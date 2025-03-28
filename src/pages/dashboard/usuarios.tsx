import React, { useState } from 'react';
import {
    Paper,
    Button,
    TextField,
    Typography,
    Box,
    Toolbar,
    InputAdornment,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { AuthUserEmpresa, UsuarioRequestType, UsuarioResponseType } from '@/api/user-types';
import { useCreateUsuarioByEmpresa, useDeleteUsuarioByEmpresa, useGetUsuariosByEmpresa, useUpdateUsuarioByEmpresa } from '@/api/user-request';
import { useParams } from 'react-router-dom';
import { UsuarioTable } from '@/components/dashboard/usuarios/usuarios-table';
import { useDispatch } from 'react-redux';
import { setFeedback } from '@/state/slices/feedBackSlice';
import { useQueryClient } from 'react-query';
import { UsuarioModal } from '@/components/dashboard/usuarios/usuarios-modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';


export function Usuarios(): React.JSX.Element {

    const queryClient = useQueryClient();

    const dispatch = useDispatch();

    const [open, setOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UsuarioResponseType | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { empresaId } = useParams<{ empresaId: string }>();


    const user = useSelector((state: RootState) => state.authSlice.user) || {
        id: 0,
        systemRole: '',
        empresas: [] as AuthUserEmpresa[]
    };


    // Si el usuario existe pero systemRole es undefined, le asignamos un valor por defecto
    const formattedUser = {
        ...user,
        systemRole: user.systemRole || '',  // Garantiza que siempre sea un string
        empresas: user.empresas.filter(emp => emp.id === Number(empresaId)),
    };

    const { data: users = [], isLoading, error } = useGetUsuariosByEmpresa(Number(empresaId));
    const { mutateAsync: createUsuarioByEmpresa } = useCreateUsuarioByEmpresa();
    const { mutateAsync: updateUsuarioByEmpresa } = useUpdateUsuarioByEmpresa();
    const { mutateAsync: deleteUsuarioByEmpresa } = useDeleteUsuarioByEmpresa();

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
                dispatch(
                    setFeedback({
                        message:
                            "No se encontró la empresa",
                        severity: "error",
                        isError: true,
                    })
                );
                return;
            }

            if (currentUser) {
                // Si el usuario ya existe, actualiza
                await updateUsuarioByEmpresa({ empresaId: Number(empresaId), userId: currentUser.id, data });
                dispatch(
                    setFeedback({
                        message:
                            "Usuario actualizado con éxito",
                        severity: "success",
                        isError: false,
                    })
                );

            } else {
                // Si es un nuevo usuario, crea
                await createUsuarioByEmpresa({ empresaId: Number(empresaId), data });
                dispatch(
                    setFeedback({
                        message:
                            "Usuario creado con éxito",
                        severity: "success",
                        isError: false,
                    })
                );
            }

            await queryClient.invalidateQueries({ queryKey: ['GetUsuariosByEmpresa', Number(empresaId)] });

            handleCloseDialog();
        } catch (error: any) {
            console.error(error);
            let mensajeError = error.mensaje || "Ocurrió un error desconocido."; // Usa un mensaje predeterminado si no hay mensaje
            dispatch(
                setFeedback({
                    message: mensajeError,
                    severity: "error",
                    isError: true,
                })
            );

        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUsuarioByEmpresa({ empresaId: Number(empresaId), userId });
            dispatch(
                setFeedback({
                    message:
                        "Usuario eliminado con éxito",
                    severity: "success",
                    isError: false,
                })
            );
        } catch (error) {
            console.error(error);
            dispatch(
                setFeedback({
                    message:
                        "Error al eliminar el usuario",
                    severity: "error",
                    isError: true,
                })
            );
        }
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
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error al cargar usuarios</Alert>;
    }



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
        </Box>
    );
};