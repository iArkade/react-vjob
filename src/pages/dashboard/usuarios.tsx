import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
    Box,
    Toolbar,
    InputAdornment,
    MenuItem,
    Alert,
    Snackbar,
    AlertColor
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface FormData {
    name: string;
    email: string;
    role: string;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

const INITIAL_FORM_DATA: FormData = {
    name: '',
    email: '',
    role: ''
};

export function Usuarios(): React.JSX.Element {

    // Estados para usuarios y paginación
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Admin' },
        { id: 2, name: 'María García', email: 'maria@ejemplo.com', role: 'Usuario' },
        { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'Editor' },
    ]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    // Estados para el diálogo y búsqueda
    const [open, setOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

    // Estado para el snackbar
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Roles disponibles
    const roles: string[] = ['Admin', 'Usuario', 'Editor'];

    // Filtrar usuarios
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejadores de eventos
    const handleChangePage = (event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (user: User | null = null): void => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role
            });
            setCurrentUser(user);
        } else {
            setFormData(INITIAL_FORM_DATA);
            setCurrentUser(null);
        }
        setOpen(true);
    };

    const handleCloseDialog = (): void => {
        setOpen(false);
        setFormData(INITIAL_FORM_DATA);
        setCurrentUser(null);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent): void => {
        e.preventDefault();
        if (currentUser) {
            // Actualizar usuario
            setUsers(users.map(user =>
                user.id === currentUser.id ? { ...formData, id: user.id } : user
            ));
            showSnackbar('Usuario actualizado exitosamente', 'success');
        } else {
            // Crear usuario
            const newUser: User = {
                ...formData,
                id: Math.max(...users.map(u => u.id)) + 1
            };
            setUsers([...users, newUser]);
            showSnackbar('Usuario creado exitosamente', 'success');
        }
        handleCloseDialog();
    };

    const handleDeleteUser = (userId: number): void => {
        setUsers(users.filter(user => user.id !== userId));
        showSnackbar('Usuario eliminado exitosamente', 'success');
    };

    const showSnackbar = (message: string, severity: AlertColor): void => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (): void => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', p: 3 }}>
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
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

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Diálogo para crear/editar usuario */}
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {currentUser ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

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