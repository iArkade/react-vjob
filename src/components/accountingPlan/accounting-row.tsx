import React, { useState } from 'react';
import { TableRow, TableCell, TextField, IconButton } from '@mui/material';
import { Pencil, Trash } from '@phosphor-icons/react';
import { AccountingPlanResponseType } from '@/api/accounting_plan/account.types';

interface AccountRowProps {
    account: AccountingPlanResponseType;
    onUpdate: (id: number, data: { code: string; name: string }) => void;
    onDelete: (code: string) => void;
}

const AccountRow: React.FC<AccountRowProps> = ({ account, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingCode, setEditingCode] = useState(account.code);
    const [editingName, setEditingName] = useState(account.name);

    const handleSave = () => {
        onUpdate(account.id, { code: editingCode, name: editingName });
        setIsEditing(false);
    };

    const calcularNivel = (codigo: string): number => {
        return codigo.split('.').filter(Boolean).length - 1;
    };

    return (
        <TableRow>
            <TableCell sx={{ paddingLeft: `${calcularNivel(account.code) * 20}px` }}>
                {isEditing ? (
                    <TextField
                        value={editingCode}
                        onChange={(e) => setEditingCode(e.target.value)}
                        variant="standard"
                        fullWidth
                    />
                ) : (
                    account.code
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        variant="standard"
                        fullWidth
                    />
                ) : (
                    account.name
                )}
            </TableCell>
            <TableCell>
                {isEditing ? (
                    <>
                        <IconButton onClick={handleSave}>
                            <Pencil size={20} />
                        </IconButton>
                        <IconButton onClick={() => setIsEditing(false)}>
                            <Trash size={20} />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton onClick={() => setIsEditing(true)}>
                            <Pencil size={20} />
                        </IconButton>
                        <IconButton onClick={() => onDelete(account.code)}>
                            <Trash size={20} />
                        </IconButton>
                    </>
                )}
            </TableCell>
        </TableRow>
    );
};

export default AccountRow;