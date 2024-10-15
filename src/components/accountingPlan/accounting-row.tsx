import React, { useState, useEffect, useCallback, memo } from 'react';
import { TableRow, TableCell, TextField, IconButton } from '@mui/material';
import { FloppyDisk, Trash } from '@phosphor-icons/react';
import { AccountingPlanResponseType } from '@/api/accounting_plan/account.types';

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

    return (
        <TableRow
            onClick={() => onRowClick(account.id)}
            style={{
                backgroundColor: isSelected ? '#2b2a2a' : 'inherit',
                cursor: 'pointer'
            }}
        >
            <TableCell sx={{ paddingLeft: `${calcularNivel(account.code) * 20}px` }}>
                <TextField
                    value={editingCode}
                    onChange={(e) => setEditingCode(e.target.value)}
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
                    <FloppyDisk size={20} weight={isChanged ? "bold" : "regular"} />
                </IconButton>
                <IconButton onClick={() => onDelete(account.code)}>
                    <Trash size={20} />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

export default AccountRow;
