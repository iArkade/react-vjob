import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Checkbox } from '@mui/material';
import { MagnifyingGlass } from "@phosphor-icons/react";

interface TransactionItem {
    codigo: string;
    nombre: string;
    nroActual: string;
    lectura: string;
    activo: boolean;
    modo: string;
}

const initialData: TransactionItem[] = [
    { codigo: 'ACOBOT', nombre: 'ASIENTO DE COBROS(OTROS)', nroActual: '0000000', lectura: '1', activo: true, modo: 'SUBSIS' },
    { codigo: 'ACOP', nombre: 'ASIENTO DE COBROS EN EFEC', nroActual: '0000002', lectura: '1', activo: false, modo: 'SUBSIS' },
    { codigo: 'ACONSIG', nombre: 'ASIENTO DE MERCADERIA EN CONS', nroActual: '0000000', lectura: '1', activo: false, modo: 'SUBSIS' },
    { codigo: 'ACONS', nombre: 'ASIENTO DE MERCADERIA CONSIGN', nroActual: '0000000', lectura: '1', activo: false, modo: 'SUBSIS' },
    { codigo: 'DACO', nombre: 'ASIENTO DE COMPRAS DIARIO', nroActual: '0000000', lectura: '1', activo: false, modo: 'SUBSIS' },
    { codigo: 'ACOB', nombre: 'ASIENTO DE COBROS', nroActual: '0000000', lectura: '1', activo: true, modo: 'SUBSIS' },
    { codigo: 'ACO', nombre: 'ASIENTO DE COMPRAS', nroActual: '0000577', lectura: '1', activo: true, modo: 'SUBSIS' },
    { codigo: 'ACOBD', nombre: 'ASIENTO DE COBRO DIARIO', nroActual: '0000000', lectura: '1', activo: true, modo: 'SUBSIS' },
    { codigo: 'APACO', nombre: 'ASIENTO DE PAGOS CONDUCTORES', nroActual: '0000000', lectura: '1', activo: true, modo: 'SUBSIS' },
    { codigo: 'ACONVE', nombre: 'ASIENTO CONVERSION', nroActual: '0000000', lectura: '1', activo: true, modo: 'SUBSIS' },
];

const TransactionClassTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [data, setData] = useState<TransactionItem[]>(initialData);

    const filteredData = data.filter(item =>
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCheckboxChange = (codigo: string) => {
        setData(prevData =>
            prevData.map(item =>
                item.codigo === codigo ? { ...item, activo: !item.activo } : item
            )
        );
    };

    return (
        <Paper className="p-4">
            <div className="flex items-center mb-4">
                <MagnifyingGlass className="text-gray-400 mr-2" size={24} />
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
            </div>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow className="bg-blue-100">
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Nro. Actual</TableCell>
                            <TableCell align="right">Lectura</TableCell>
                            <TableCell align="center">Activo</TableCell>
                            <TableCell>Modo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row) => (
                            <TableRow key={row.codigo} className="bg-cyan-50">
                                <TableCell>{row.codigo}</TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell align="right">{row.nroActual}</TableCell>
                                <TableCell align="right">{row.lectura}</TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={row.activo}
                                        onChange={() => handleCheckboxChange(row.codigo)}
                                    />
                                </TableCell>
                                <TableCell>{row.modo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TransactionClassTable;