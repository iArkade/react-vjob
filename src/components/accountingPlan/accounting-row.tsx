import React, { useState, useEffect, useCallback, memo } from 'react';
import { TableRow, TableCell, TextField, IconButton } from '@mui/material';
import { FloppyDisk, Trash } from '@phosphor-icons/react';
import { AccountingPlanResponseType } from '@/api/accounting-plan/account-types';

interface AccountRowProps {
    account: AccountingPlanResponseType;
    onUpdate: (id: number, data: { code: string; name: string }) => void;
    onDelete: (code: string) => void;
    isSelected: boolean;
    onRowClick: (id: number) => void;
}

const AccountRow: React.FC<AccountRowProps> = memo(({ account, onUpdate, onDelete, isSelected, onRowClick }) => {
    const [editingCode, setEditingCode] = useState(account.code);
    const [editingName, setEditingName] = useState(account.name);
    const [isChanged, setIsChanged] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [errorCode, setErrorCode] = useState<string | null>(null);

    useEffect(() => {
        // Detecta si el sistema está usando el tema oscuro
        const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkTheme(darkThemeMq.matches); // Establece el estado inicial

        const themeChangeListener = (e: MediaQueryListEvent) => {
            setIsDarkTheme(e.matches); // Cambia el estado si el tema del sistema cambia
        };

        // Agrega el listener para detectar cambios en el tema del sistema
        darkThemeMq.addEventListener('change', themeChangeListener);

        // Limpia el listener cuando el componente se desmonta
        return () => darkThemeMq.removeEventListener('change', themeChangeListener);
    }, []);

    useEffect(() => {
        setIsChanged(editingCode !== account.code || editingName !== account.name);
    }, [editingCode, editingName, account.code, account.name]);

    const handleSave = useCallback(() => {
        if (isChanged) {
            onUpdate(account.id, { code: editingCode, name: editingName });
            setIsChanged(false);
        }
    }, [isChanged, onUpdate, account.id, editingCode, editingName]);

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
                />
            </TableCell>
            <TableCell>
                <TextField
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    variant="standard"
                    fullWidth
                />
            </TableCell>
            <TableCell>
                <IconButton onClick={handleSave} disabled={!isChanged}>
                    <FloppyDisk size={20} weight={isChanged ? 'bold' : 'regular'} />
                </IconButton>
                <IconButton onClick={() => onDelete(account.code)}>
                    <Trash size={20} />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

export default AccountRow;
