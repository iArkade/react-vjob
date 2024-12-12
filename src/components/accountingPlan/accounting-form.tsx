import React, { useState, useCallback, memo } from "react";
import { TableRow, TableCell, TextField, Button } from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react";
import { AccountingPlanRequestType } from "@/api/accounting-plan/account-types";

interface AccountFormProps {
  onSubmit: (account: AccountingPlanRequestType) => void;
}

const AccountForm: React.FC<AccountFormProps> = memo(({ onSubmit }) => {
  const [newAccount, setNewAccount] = useState<AccountingPlanRequestType>({
    code: "",
    name: "",
  });
  const [error, setError] = useState({ code: false, name: false, codeMessage: "" });

  const handleInputChange = useCallback(
    (field: "code" | "name") => (e: React.ChangeEvent<HTMLInputElement>) => {
      
      const value = e.target.value;

      if (field === "code") {
        const regex = /^[0-9.]*$/; // Permite números y puntos
        if (!regex.test(value)) {
          setError((prev) => ({
            ...prev,
            code: true,
            codeMessage: "Solo se permiten números y puntos en el código",
          }));
          return; // No actualizamos el estado si el valor es inválido
        }

        // Si el valor es válido, limpiamos el error
        setError((prev) => ({
          ...prev,
          code: false,
          codeMessage: "",
        }));
      }
      
      setNewAccount((prev) => ({ ...prev, [field]: e.target.value }));
      setError((prev) => ({ ...prev, [field]: false }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (newAccount.code.trim() === "" || newAccount.name.trim() === "") {
      setError({
        code: newAccount.code.trim() === "",
        name: newAccount.name.trim() === "",
        codeMessage: "",
      });
      return;
    }

    onSubmit(newAccount);
    setNewAccount({ code: "", name: "" });
  }, [newAccount, onSubmit]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <TableRow>
      <TableCell>
        <TextField
          autoFocus
          placeholder="Nuevo código"
          value={newAccount.code}
          onChange={handleInputChange("code")}
          variant="outlined"
          fullWidth
          error={error.code}
          helperText={error.code ? error.codeMessage  : ""}
          onKeyUp={handleKeyPress}
        />
      </TableCell>
      <TableCell>
        <TextField
          placeholder="Nuevo nombre"
          value={newAccount.name}
          onChange={handleInputChange("name")}
          variant="outlined"
          fullWidth
          error={error.name}
          helperText={error.name ? "El nombre es obligatorio" : ""}
          onKeyUp={handleKeyPress}
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
});

export default AccountForm;
