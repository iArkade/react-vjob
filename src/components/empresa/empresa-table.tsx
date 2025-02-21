import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { EmpresaResponseType, EmpresaConUsuariosType } from '@/api/empresas/empresa-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEmpresa } from '@/state/slices/empresaSlice';
import { EmpresaConRolType } from '@/api/empresas/empresa-types';
import { RootState } from '@/state/store';

interface EmpresaTableProps {
    empresas: EmpresaConUsuariosType[]; // Usar la nueva interfaz para el superadmin
    onEdit: (empresa: EmpresaResponseType) => void;
    onDelete: (id: number) => void;
}

const EmpresaTable: React.FC<EmpresaTableProps> = ({ empresas, onEdit, onDelete }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.authSlice);

    const handleViewDashboard = (empresa: EmpresaConUsuariosType) => {
        if (!user) {
            console.error("User no está definido.");
            return;
        }

        // Eliminar la propiedad `usuarios` antes de guardar
        const { usuarios, ...empresaSinUsuarios } = empresa;

        // Determinar el rol del usuario en la empresa
        let companyRole = "admin"; // Rol por defecto para el superadmin

        if (empresa.usuarios) {
            const userEmpresa = empresa.usuarios.find(
                (ue) => ue.usuario.id === user.id
            );
            if (userEmpresa) {
                companyRole = userEmpresa.companyRole;
            }
        }

        // Crear el objeto empresa con el rol del usuario
        const empresaConRol: EmpresaConRolType = {
            ...empresaSinUsuarios,
            companyRole, // Usar el companyRole del usuario en la empresa
        };

        // Guardar la empresa seleccionada en el estado y en localStorage
        dispatch(setSelectedEmpresa(empresaConRol));
        localStorage.setItem("selectedEmpresa", JSON.stringify(empresaConRol));

        // Redirigir al dashboard de la empresa seleccionada
        navigate(`/empresa/${empresa.id}/dashboard`);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Código</TableCell>
                            <TableCell sx={{ color: 'white' }}>RUC</TableCell>
                            <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                            <TableCell sx={{ color: 'white' }}>Correo</TableCell>
                            <TableCell sx={{ color: 'white' }}>Teléfono</TableCell>
                            <TableCell sx={{ color: 'white' }}>Dirección</TableCell>
                            <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empresas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((empresa) => (
                            <TableRow key={empresa.id} hover>
                                <TableCell>{empresa.codigo}</TableCell>
                                <TableCell>{empresa.ruc}</TableCell>
                                <TableCell>{empresa.nombre}</TableCell>
                                <TableCell>{empresa.correo}</TableCell>
                                <TableCell>{empresa.telefono}</TableCell>
                                <TableCell>{empresa.direccion}</TableCell>
                                <TableCell>
                                    {/* Botón para ver el dashboard */}
                                    <Tooltip title="Ver dashboard" arrow>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleViewDashboard(empresa)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Botón para editar */}
                                    <Tooltip title="Editar" arrow>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(empresa)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Botón para eliminar */}
                                    <Tooltip title="Eliminar" arrow>
                                        <IconButton
                                            color="error"
                                            onClick={() => onDelete(empresa.id)}
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
                count={empresas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default React.memo(EmpresaTable);