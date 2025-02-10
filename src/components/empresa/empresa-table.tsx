import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { EmpresaResponseType } from '@/api/empresas/empresa-types';

interface EmpresaTableProps {
    empresas: EmpresaResponseType[];
    onEdit: (empresa: EmpresaResponseType) => void;
    onDelete: (id: number) => void;
}

const EmpresaTable: React.FC<EmpresaTableProps> = ({ empresas, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>RUC</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell>Teléfono</TableCell>
                        <TableCell>Dirección</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {empresas.map((empresa) => (
                        <TableRow key={empresa.id}>
                            <TableCell>{empresa.codigo}</TableCell>
                            <TableCell>{empresa.ruc}</TableCell>
                            <TableCell>{empresa.nombre}</TableCell>
                            <TableCell>{empresa.correo}</TableCell>
                            <TableCell>{empresa.telefono}</TableCell>
                            <TableCell>{empresa.direccion}</TableCell>
                            <TableCell>
                                <Button onClick={() => onEdit(empresa)} color="primary">Editar</Button>
                                <Button onClick={() => onDelete(empresa.id)} color="secondary">Eliminar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EmpresaTable;
