import React, { useState, useCallback, memo } from 'react';
import { TableRow, TableCell, TextField, Button, Checkbox } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TransaccionContableRequestType } from '@/api/transaccion_contable/transaccion-contable.types';

interface TransactionFormProps {
    onSubmit: (transaction: TransaccionContableRequestType) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = memo(({ onSubmit }) => {
    const [newTransaction, setNewTransaction] = useState<TransaccionContableRequestType>({ codigo_transaccion: '', nombre: '', secuencial: 0, lectura: 0, activo: false });
    const [error, setError] = useState({ codigo_transaccion: false, nombre: false, secuencial: false, lectura: false, activo: false });

    const handleInputChange = useCallback((field: 'codigo_transaccion' | 'nombre' | 'secuencial' | 'lectura' | 'activo') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTransaction(prev => ({ ...prev, [field]: e.target.value }));
        setError(prev => ({ ...prev, [field]: false }));
    }, []);

    const handleSubmit = useCallback(() => {
        if (newTransaction.codigo_transaccion.trim() === '' || newTransaction.nombre.trim() === '' || newTransaction.secuencial < 0  ) {
            setError({
                codigo_transaccion: newTransaction.codigo_transaccion.trim() === '',
                nombre: newTransaction.nombre.trim() === '',
                secuencial: newTransaction.secuencial === 0,
                lectura: newTransaction.lectura === 0,
                activo: newTransaction.activo === false,
            });
            return;
        }

        onSubmit(newTransaction);
        setNewTransaction({ codigo_transaccion: '', nombre: '', secuencial: 0, lectura: 0, activo: false });
    }, [newTransaction, onSubmit]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        },
        [handleSubmit]
    );

    return (
        <TableRow>
            <TableCell>
                <TextField
                    placeholder="Nuevo código"
                    value={newTransaction.codigo_transaccion}
                    onChange={handleInputChange('codigo_transaccion')}
                    variant="standard"
                    fullWidth
                    size="small"
                    error={error.codigo_transaccion}
                    helperText={error.codigo_transaccion ? "El código es obligatorio" : ""}
                    onKeyUp={handleKeyPress}
                />
            </TableCell>
            <TableCell>
                <TextField
                    placeholder="Nuevo nombre"
                    value={newTransaction.nombre}
                    onChange={handleInputChange('nombre')}
                    variant="standard"
                    fullWidth
                    size="small"
                    error={error.nombre}
                    helperText={error.nombre ? "El nombre es obligatorio" : ""}
                    onKeyUp={handleKeyPress}
                    
                />
            </TableCell>
            <TableCell>
                <TextField
                    type="number"
                    placeholder="Secuencial"
                    value={newTransaction.secuencial}
                    onChange={handleInputChange('secuencial')}
                    variant="standard"
                    fullWidth
                    size="small"
                    error={error.secuencial}
                    helperText={error.secuencial ? "El secuencial es obligatorio" : ""}
                    onKeyUp={handleKeyPress}
                />
            </TableCell>
            <TableCell>
                <TextField
                    type="number"
                    placeholder="Lectura"
                    value={newTransaction.lectura}
                    onChange={handleInputChange('lectura')}
                    variant="standard"
                    inputProps={{ min: 0, max: 1 }}
                    fullWidth
                    size="small"
                />
            </TableCell>
            <TableCell align="center">
                <Checkbox 
                    checked={newTransaction.activo}
                    onChange={(e, checked) => {
                        setNewTransaction(prev => ({
                            ...prev,
                            activo: checked
                        }));
                    }}
                />
            </TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    startIcon={<AddIcon />}
                    fullWidth
                >
                    Agregar
                </Button>
            </TableCell>
        </TableRow>
    );
});

export default TransactionForm;