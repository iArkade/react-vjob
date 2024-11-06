import React, { useState, useCallback, memo } from 'react';
import { TableRow, TableCell, TextField, Button, Checkbox } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TransaccionContableRequestType } from '@/api/transaccion_contable/transaccion-contable.types';

interface TransactionFormProps {
    onSubmit: (transaction: TransaccionContableRequestType) => void;
    existingTransactions?: TransaccionContableRequestType[]; // Añadimos esta prop para validar códigos duplicados
}

const TransactionForm: React.FC<TransactionFormProps> = memo(({ onSubmit, existingTransactions = [] }) => {
    const [newTransaction, setNewTransaction] = useState<TransaccionContableRequestType>({
        codigo_transaccion: '',
        nombre: '',
        secuencial: 0,
        lectura: 0,
        activo: false
    });

    const [errors, setErrors] = useState({
        codigo_transaccion: '',
        nombre: '',
        secuencial: '',
        lectura: '',
    });

    const validateField = useCallback((field: keyof typeof newTransaction, value: any) => {
        switch (field) {
            case 'codigo_transaccion':
                if (!value.trim()) {
                    return 'El código es obligatorio';
                }
                if (existingTransactions.some(t => t.codigo_transaccion === value)) {
                    return 'El código ya existe';
                }
                return '';
            case 'nombre':
                return !value.trim() ? 'El nombre es obligatorio' : '';
            case 'secuencial':
                return value <= 0 ? 'El secuencial debe ser mayor a 0' : '';
            case 'lectura':
                return (value !== 0 && value !== 1) ? 'La lectura debe ser 0 o 1' : '';
            default:
                return '';
        }
    }, [existingTransactions]);

    const handleInputChange = useCallback((field: keyof typeof newTransaction) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'secuencial' || field === 'lectura' 
            ? Number(e.target.value)
            : e.target.value;

        setNewTransaction(prev => ({ ...prev, [field]: value }));
        
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    }, [validateField]);

    const handleSubmit = useCallback(() => {
        // Validar todos los campos
        const newErrors = {
            codigo_transaccion: validateField('codigo_transaccion', newTransaction.codigo_transaccion),
            nombre: validateField('nombre', newTransaction.nombre),
            secuencial: validateField('secuencial', newTransaction.secuencial),
            lectura: validateField('lectura', newTransaction.lectura),
        };

        setErrors(newErrors);

        // Si hay errores, solo limpiar los campos con error
        if (Object.values(newErrors).some(error => error !== '')) {
            setNewTransaction(prev => {
                const updated = { ...prev };
                if (newErrors.codigo_transaccion) updated.codigo_transaccion = '';
                if (newErrors.nombre) updated.nombre = '';
                if (newErrors.secuencial) updated.secuencial = 0;
                if (newErrors.lectura) updated.lectura = 0;
                return updated;
            });
            return;
        }

        // Si no hay errores, enviar y limpiar todo
        onSubmit(newTransaction);
        setNewTransaction({ codigo_transaccion: '', nombre: '', secuencial: 0, lectura: 0, activo: false });
        setErrors({ codigo_transaccion: '', nombre: '', secuencial: '', lectura: '' });
    }, [newTransaction, onSubmit, validateField]);

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
                    error={!!errors.codigo_transaccion}
                    helperText={errors.codigo_transaccion}
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
                    error={!!errors.nombre}
                    helperText={errors.nombre}
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
                    error={!!errors.secuencial}
                    helperText={errors.secuencial}
                    onKeyUp={handleKeyPress}
                />
            </TableCell>
            <TableCell>
                <TextField
                    type="number"
                    placeholder="Lectura"
                    value={newTransaction.lectura}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        if (value === '' || value === '0' || value === '1') {
                            handleInputChange('lectura')(e);
                        }
                    }}
                    variant="standard"
                    inputProps={{ min: 0, max: 1, maxLength: 1 }}
                    fullWidth
                    size="small"
                    error={!!errors.lectura}
                    helperText={errors.lectura}
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