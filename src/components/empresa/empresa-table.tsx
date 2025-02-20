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
} from '@mui/icons-material';
import { EmpresaResponseType } from '@/api/empresas/empresa-types';

interface EmpresaTableProps {
    empresas: EmpresaResponseType[];
    onEdit: (empresa: EmpresaResponseType) => void;
    onDelete: (id: number) => void;
}

const EmpresaTable: React.FC<EmpresaTableProps> = ({ empresas, onEdit, onDelete }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
                                    <Tooltip title="Editar" arrow>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(empresa)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
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