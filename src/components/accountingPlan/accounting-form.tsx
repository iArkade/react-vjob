import React, { useState } from 'react';
import { TableRow, TableCell, TextField, Button } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { AccountingPlanRequestType } from '@/api/accounting_plan/account.types';

interface AccountFormProps {
    onSubmit: (account: AccountingPlanRequestType) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit }) => {
    const [newAccount, setNewAccount] = useState<AccountingPlanRequestType>({ code: '', name: '' });

    const handleSubmit = () => {
        onSubmit(newAccount);
        setNewAccount({ code: '', name: '' });
    };

    return (
        <TableRow>
            <TableCell>
                <TextField
                    placeholder="Nuevo código"
                    value={newAccount.code}
                    onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                    variant="standard"
                    fullWidth
                />
            </TableCell>
            <TableCell>
                <TextField
                    placeholder="Nuevo nombre"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    variant="standard"
                    fullWidth
                />
            </TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    startIcon={<PlusIcon />}
                >
                    Agregar Cuenta
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default AccountForm;