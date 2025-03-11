import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    TextField,
    InputAdornment,
    Typography,
    Box,
    Toolbar,
    Avatar,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { UsuarioResponseType } from '@/api/user-types';

interface UsuariosTableProps {
    users: UsuarioResponseType[];
    onEdit: (user: UsuarioResponseType) => void;
    onDelete: (userId: number) => void;
}

export function UsuariosTable({ users, onEdit, onDelete }: UsuariosTableProps) {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.systemRole?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (_: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Toolbar sx={{ px: { xs: 2, sm: 3 }, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
                        sx: { bgcolor: 'white', borderRadius: 1 },
                    }}
                    sx={{ mr: 2 }}
                />
            </Toolbar>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white' }}>Rol</TableCell>
                            <TableCell sx={{ color: 'white' }}>Estado</TableCell>
                            <TableCell align="right" sx={{ color: 'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                                            {`${user.name} ${user.lastname || ''}`}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.systemRole}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.active ? 'Activo' : 'Inactivo'}
                                            color={user.active ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar" arrow>
                                            <IconButton
                                                color="primary"
                                                onClick={() => onEdit(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar" arrow>
                                            <IconButton
                                                color="error"
                                                onClick={() => onDelete(user.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
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
    );
}