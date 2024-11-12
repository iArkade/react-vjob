import React, { useState, useCallback, memo } from 'react';
import { TableRow, TableCell, TextField, Button, Checkbox } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { CentroCostoRequestType } from '@/api/centro_costo/centro-costo.types';

interface CostCenterFormProps {
    onSubmit: (costCenter: CentroCostoRequestType) => void;
    existingCostCenters?: CentroCostoRequestType[];
}

const CostCenterForm: React.FC<CostCenterFormProps> = memo(({ onSubmit, existingCostCenters = [] }) => {
    const [newCostCenter, setNewCostCenter] = useState<CentroCostoRequestType>({
        codigo: '',
        nombre: '',
        activo: false
    });

    const [errors, setErrors] = useState({
        codigo: '',
        nombre: '',
    });

    const validateField = useCallback((field: keyof typeof newCostCenter, value: any) => {
        switch (field) {
            case 'codigo':
                if (!value.trim()) {
                    return 'El código es obligatorio';
                }
                if (existingCostCenters.some(t => t.codigo === value)) {
                    return 'El código ya existe';
                }
                return '';
            case 'nombre':
                return !value.trim() ? 'El nombre es obligatorio' : '';
            default:
                return '';
        }
    }, [existingCostCenters]);

    const handleInputChange = useCallback((field: keyof typeof newCostCenter) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        setNewCostCenter(prev => ({ ...prev, [field]: value }));
        
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    }, [validateField]);


    const handleSubmit = useCallback(() => {
        const newErrors = {
            codigo: validateField('codigo', newCostCenter.codigo),
            nombre: validateField('nombre', newCostCenter.nombre),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }

        onSubmit(newCostCenter);
        setNewCostCenter({ 
            codigo: '', 
            nombre: '',  
            activo: false 
        });
        setErrors({ codigo: '', nombre: '' });
    }, [newCostCenter, onSubmit, validateField]);

    return (
        <TableRow>
            <TableCell>
                <TextField
                    placeholder="Nuevo código"
                    value={newCostCenter.codigo}
                    onChange={handleInputChange('codigo')}
                    variant="standard"
                    fullWidth
                    size="small"
                    error={!!errors.codigo}
                    helperText={errors.codigo}
                />
            </TableCell>
            <TableCell>
                <TextField
                    placeholder="Nuevo nombre"
                    value={newCostCenter.nombre}
                    onChange={handleInputChange('nombre')}
                    variant="standard"
                    fullWidth
                    size="small"
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                />
            </TableCell>
            <TableCell align="center">
                <Checkbox
                    checked={newCostCenter.activo}
                    onChange={(e, checked) => {
                        setNewCostCenter(prev => ({
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

export default CostCenterForm;