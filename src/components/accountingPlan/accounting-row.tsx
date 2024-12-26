import React, { useState, useEffect, useCallback, memo } from 'react'; 
import Swal from 'sweetalert2';
import { 
    TableRow, 
    TableCell, 
    TextField, 
    IconButton 
} from '@mui/material'; 
import { FloppyDisk, Trash } from '@phosphor-icons/react'; 
import { AccountingPlanResponseType } from '@/api/accounting-plan/account-types';
import { validateCode } from '@/utils/validators';

interface AccountRowProps {     
    account: AccountingPlanResponseType;     
    onUpdate: (id: number, data: { code: string; name: string, empresa_id: number }, empresa_id: number) => Promise<{ success: boolean; error?: string }>;     
    onDelete: (code: string, empresa_id: number) => void;     
    isSelected: boolean;     
    onRowClick: (id: number) => void; 
}  

const AccountRow: React.FC<AccountRowProps> = memo(({ 
    account, 
    onUpdate, 
    onDelete, 
    isSelected, 
    onRowClick 
}) => {     
    const [editingCode, setEditingCode] = useState(account.code);
    const [editingName, setEditingName] = useState(account.name);
    const [originalCode, setOriginalCode] = useState(account.code);
    const [originalName, setOriginalName] = useState(account.name);
    const [isChanged, setIsChanged] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [errorCode, setErrorCode] = useState<string | null>(null);

    useEffect(() => {
        // Detecta si el sistema está usando el tema oscuro
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkTheme(darkThemeMq.matches);

        const themeChangeListener = (e: MediaQueryListEvent) => {
            setIsDarkTheme(e.matches);
        };

        darkThemeMq.addEventListener('change', themeChangeListener);

        return () => darkThemeMq.removeEventListener('change', themeChangeListener);
    }, []);

    useEffect(() => {
        setIsChanged(editingCode !== account.code || editingName !== account.name);
        setErrorMessage(null);
    }, [editingCode, editingName, account.code, account.name]);

    const restoreOriginalValues = useCallback(() => {
        setEditingCode(originalCode);
        setEditingName(originalName);
        setIsChanged(false);
        setIsEditing(false);
        setErrorMessage(null);
    }, [originalCode, originalName]);

    const handleSave = useCallback(async () => {
        if (isChanged) {
            // Validación de inputs usando validateCode del hook
            if (!validateCode(editingCode)) {
                setErrorMessage('Código inválido');
                restoreOriginalValues();
                return;
            }

            // Validación de nombre no vacío
            if (!editingName || editingName.trim() === '') {
                setErrorMessage('El nombre no puede estar vacío');
                restoreOriginalValues();
                return;
            }

            // Show SweetAlert2 confirmation
            Swal.fire({
                title: '¿Está seguro?',
                text: 'Desea actualizar los campos',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const updateResult = await onUpdate(account.id, { 
                            code: editingCode, 
                            name: editingName, 
                            empresa_id: account.empresa_id
                        }, account.empresa_id);

                        if (updateResult.success) {
                            // Actualización exitosa
                            setOriginalCode(editingCode);
                            setOriginalName(editingName);
                            setIsChanged(false);
                            setIsEditing(false);

                            Swal.fire({
                                title: 'Actualizado',
                                text: 'Los campos han sido actualizados correctamente',
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        } else {
                            // Error en la actualización
                            setErrorMessage(updateResult.error || 'Error al actualizar');
                            restoreOriginalValues();

                            Swal.fire({
                                title: 'Error',
                                text: updateResult.error || 'No se pudo actualizar',
                                icon: 'error'
                            });
                        }
                    } catch (error) {
                        // Error inesperado
                        setErrorMessage('Error inesperado');
                        restoreOriginalValues();

                        Swal.fire({
                            title: 'Error',
                            text: 'Ha ocurrido un error inesperado',
                            icon: 'error'
                        });
                    }
                } else {
                    // User clicked cancel, restore original values
                    restoreOriginalValues();
                }
            });
        }
    }, [isChanged, editingCode, editingName, restoreOriginalValues, onUpdate, account.id, account.empresa_id]);

    const calcularNivel = useCallback((codigo: string): number => {
        return codigo.split('.').filter(Boolean).length - 1;
    }, []);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
    
        // Validar que solo sean números
        const regex =  /^[0-9.]*$/;
        if (regex.test(value) || value === '') {
            setEditingCode(value); 
            setErrorCode(null);
        } else {
            setErrorCode("El código debe contener solo números y puntos."); // Mensaje de error
        }
    };

    return (
        <TableRow
            onClick={() => onRowClick(account.id)}
            style={{
                backgroundColor: isSelected
                    ? isDarkTheme
                        ? '#2b2a2a' // Color oscuro si el tema es oscuro
                        : '#d3d3d3' // Color claro si el tema es claro
                    : 'inherit',
                cursor: 'pointer'
            }}
        >
            <TableCell sx={{ paddingLeft: `${calcularNivel(account.code) * 20}px` }}>
                <TextField
                    value={editingCode}
                    //onChange={(e) => setEditingCode(e.target.value)}
                    onChange={handleCodeChange}
                    error={!!errorCode} // Si errorCode no es null, se activa el error
                    helperText={errorCode || ""} // Most
                    variant="standard"
                    fullWidth
                    error={!!errorMessage || (isEditing && !validateCode(editingCode))}
                    helperText={
                        errorMessage || 
                        (isEditing && !validateCode(editingCode) 
                            ? "Código inválido" 
                            : "")
                    }
                />
            </TableCell>
            <TableCell>
                <TextField
                    value={editingName}
                    onChange={handleInputChange('name')}
                    variant="standard"
                    fullWidth
                    error={!!errorMessage || (isEditing && (!editingName || editingName.trim() === ''))}
                    helperText={
                        errorMessage || 
                        (isEditing && (!editingName || editingName.trim() === '')
                            ? "El nombre no puede estar vacío" 
                            : "")
                    }
                />
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <>
                        <IconButton onClick={handleSave} disabled={!isChanged}>
                            <FloppyDisk size={20} weight={isChanged ? 'bold' : 'regular'} />
                        </IconButton>
                        <IconButton onClick={handleCancelEditing}>
                            <Trash size={20} />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton onClick={handleSave} disabled={!isChanged}>
                            <FloppyDisk size={20} weight={isChanged ? 'bold' : 'regular'} />
                        </IconButton>
                        <IconButton onClick={() => onDelete(account.code, account.empresa_id)}>
                            <Trash size={20} />
                        </IconButton>
                    </>
                )}
            </TableCell>
        </TableRow>
    ); 
});

export default AccountRow;