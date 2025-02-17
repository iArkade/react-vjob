import React, { useState, useCallback, memo } from "react";
import { TableRow, TableCell, TextField, Button } from "@mui/material";
import { Plus as PlusIcon } from "@phosphor-icons/react";
import { AccountingPlanRequestType } from "@/api/accounting-plan/account-types";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface AccountFormProps {
  onSubmit: (account: AccountingPlanRequestType) => void;
}

const AccountForm: React.FC<AccountFormProps> = memo(({ onSubmit }) => {
  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
  const [newAccount, setNewAccount] = useState<AccountingPlanRequestType>({
    code: "",
    name: "",
    empresa_id: selectedEmpresa.id
  });
  const [error, setError] = useState({ code: false, name: false });

  const handleInputChange = useCallback(
    (field: "code" | "name") => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      });
      return;
    }

    onSubmit(newAccount);
    setNewAccount({ code: "", name: "", empresa_id: selectedEmpresa.id });
  }, [newAccount, onSubmit, selectedEmpresa.id]);

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
          helperText={error.code ? "El código es obligatorio" : ""}
          onKeyUp={handleKeyPress}
          onKeyDown={(e) => {
            const allowedKeys = [
              "Backspace",
              "Tab",
              "ArrowLeft",
              "ArrowRight",
              "Delete",
              ".",
            ];
            const isNumber = e.key >= "0" && e.key <= "9";

            if (!isNumber && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }}
          inputProps={{
            pattern: "[0-9.]*", // Permite números y puntos
          }}
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