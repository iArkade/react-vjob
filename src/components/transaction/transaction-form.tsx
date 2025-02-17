import React, { useState, useCallback, memo, useRef } from "react";
import {
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TransaccionContableRequestType } from "@/api/transaccion_contable/transaccion-contable-types";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface TransactionFormProps {
  onSubmit: (transaction: TransaccionContableRequestType) => void;
  existingTransactions?: TransaccionContableRequestType[];
}

const TransactionForm: React.FC<TransactionFormProps> = memo(
  ({ onSubmit, existingTransactions = [] }) => {
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
    const [newTransaction, setNewTransaction] =
      useState<TransaccionContableRequestType>({
        codigo_transaccion: "",
        nombre: "",
        secuencial: "000000001",
        lectura: 1,
        activo: true,
        empresa_id: selectedEmpresa.id
      });

    const [errors, setErrors] = useState({
      codigo_transaccion: "",
      nombre: "",
      secuencial: "",
      lectura: "",
    });

    // Referencias más específicas
    const codigoRef = useRef<HTMLInputElement>(null);
    const nombreRef = useRef<HTMLInputElement>(null);
    const secuencialRef = useRef<HTMLInputElement>(null);
    const lecturaRef = useRef<HTMLInputElement>(null);
    const checkboxRef = useRef<HTMLButtonElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    const validateField = useCallback(
      (field: keyof typeof newTransaction, value: any) => {
        switch (field) {
          case "codigo_transaccion":
            if (!value.trim()) {
              return "El código es obligatorio";
            }
            if (
              existingTransactions.some((t) => t.codigo_transaccion === value)
            ) {
              return "El código ya existe";
            }
            return "";
          case "nombre":
            return !value.trim() ? "El nombre es obligatorio" : "";
          case "secuencial":
            return value === "000000000"
              ? "El secuencial no puede ser 000000000"
              : "";
          case "lectura":
            return value !== 0 && value !== 1
              ? "La lectura debe ser 0 o 1"
              : "";
          default:
            return "";
        }
      },
      [existingTransactions]
    );

    const handleInputChange = useCallback(
      (field: keyof typeof newTransaction) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const value =
            field === "lectura" ? Number(e.target.value) : e.target.value;

          setNewTransaction((prev) => ({ ...prev, [field]: value }));

          const error = validateField(field, value);
          setErrors((prev) => ({ ...prev, [field]: error }));
        },
      [validateField]
    );

    const handleSecuencialKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto
        const { key } = e;

        setNewTransaction((prev) => {
          if (/^\d$/.test(key)) {
            // Si es un número, lo añadimos al final y eliminamos el primer dígito
            const updatedSecuencial = prev.secuencial.slice(1) + key;
            return { ...prev, secuencial: updatedSecuencial };
          } else if (key === "Backspace" || key === "Delete") {
            // Si es borrar, movemos un 0 al inicio y el resto de números a la derecha
            const updatedSecuencial = "0" + prev.secuencial.slice(0, -1);
            return { ...prev, secuencial: updatedSecuencial };
          }
          return prev; // Si no es número ni borrar, mantenemos el valor actual
        });
      },
      []
    );

    const focusNextElement = useCallback(() => {
      const refs = [
        codigoRef,
        nombreRef,
        secuencialRef,
        lecturaRef,
        checkboxRef,
        submitButtonRef,
      ];

      const currentRef = document.activeElement;

      const currentIndex = refs.findIndex(
        (ref) =>
          ref.current === currentRef ||
          ref.current?.contains(currentRef as Node)
      );

      if (currentIndex !== -1 && currentIndex < refs.length - 1) {
        refs[currentIndex + 1].current?.focus();
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          focusNextElement();
        }
      },
      [focusNextElement]
    );

    const handleSubmit = useCallback(() => {
      const newErrors = {
        codigo_transaccion: validateField(
          "codigo_transaccion",
          newTransaction.codigo_transaccion
        ),
        nombre: validateField("nombre", newTransaction.nombre),
        secuencial: validateField("secuencial", newTransaction.secuencial),
        lectura: validateField("lectura", newTransaction.lectura),
      };

      setErrors(newErrors);

      if (Object.values(newErrors).some((error) => error !== "")) {
        return;
      }

      onSubmit(newTransaction);
      setNewTransaction({
        codigo_transaccion: "",
        nombre: "",
        secuencial: "000000001", // Reset a 000000001
        lectura: 1,
        activo: true,
        empresa_id: selectedEmpresa.id
      });
      setErrors({
        codigo_transaccion: "",
        nombre: "",
        secuencial: "",
        lectura: "",
      });

      // Volver al primer campo después de submit
      codigoRef.current?.focus();
    }, [newTransaction, onSubmit, validateField]);

    return (
      <TableRow>
        <TableCell>
          <TextField
            autoFocus
            inputRef={codigoRef}
            placeholder="Nuevo código"
            value={newTransaction.codigo_transaccion}
            onChange={handleInputChange("codigo_transaccion")}
            variant="outlined"
            fullWidth
            size="small"
            error={!!errors.codigo_transaccion}
            helperText={errors.codigo_transaccion}
            InputProps={{
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e),
            }}
          />
        </TableCell>
        <TableCell>
          <TextField
            inputRef={nombreRef}
            placeholder="Nuevo nombre"
            value={newTransaction.nombre}
            onChange={handleInputChange("nombre")}
            variant="outlined"
            fullWidth
            size="small"
            error={!!errors.nombre}
            helperText={errors.nombre}
            InputProps={{
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e),
            }}
          />
        </TableCell>
        <TableCell>
          <TextField
            inputRef={secuencialRef}
            placeholder="Secuencial"
            value={newTransaction.secuencial}
            variant="outlined"
            fullWidth
            size="small"
            error={!!errors.secuencial}
            helperText={errors.secuencial}
            InputProps={{
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleKeyDown(e);
                } else {
                  handleSecuencialKeyDown(e);
                }
              },
            }}
          />
        </TableCell>
        <TableCell>
          <TextField
            inputRef={lecturaRef}
            type="number"
            placeholder="Lectura"
            value={newTransaction.lectura}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "" || value === "0" || value === "1") {
                handleInputChange("lectura")(e);
              }
            }}
            variant="standard"
            inputProps={{ min: 0, max: 1 }}
            fullWidth
            size="small"
            error={!!errors.lectura}
            helperText={errors.lectura}
            InputProps={{
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e),
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Checkbox
            ref={checkboxRef}
            checked={newTransaction.activo}
            onChange={(e, checked) => {
              setNewTransaction((prev) => ({
                ...prev,
                activo: checked,
              }));
            }}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </TableCell>
        <TableCell>
          <Button
            ref={submitButtonRef}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              } else {
                handleKeyDown(e);
              }
            }}
            startIcon={<AddIcon />}
            fullWidth
          >
            Agregar
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

export default TransactionForm;
