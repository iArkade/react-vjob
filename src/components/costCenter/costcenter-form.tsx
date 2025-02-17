import React, { useState, useCallback, memo, useRef } from "react";
import {
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CentroCostoRequestType } from "@/api/centro_costo/centro-costo.types";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

interface CostCenterFormProps {
  onSubmit: (costCenter: CentroCostoRequestType) => void;
  existingCostCenters?: CentroCostoRequestType[];
}

const CostCenterForm: React.FC<CostCenterFormProps> = memo(
  ({ onSubmit, existingCostCenters = [] }) => {
    const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
    const [newCostCenter, setNewCostCenter] = useState<CentroCostoRequestType>({
      codigo: "",
      nombre: "",
      activo: true,
      empresa_id: selectedEmpresa.id
    });

    const [errors, setErrors] = useState({
      codigo: "",
      nombre: "",
    });

    // Referencias más específicas
    const codigoRef = useRef<HTMLInputElement | null>(null);
    const nombreRef = useRef<HTMLInputElement | null>(null);
    const checkboxRef = useRef<HTMLButtonElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);

    const validateField = useCallback(
      (field: keyof typeof newCostCenter, value: any) => {
        switch (field) {
          case "codigo":
            if (!value.trim()) {
              return "El código es obligatorio";
            }
            if (existingCostCenters.some((t) => t.codigo === value)) {
              return "El código ya existe";
            }
            return "";
          case "nombre":
            return !value.trim() ? "El nombre es obligatorio" : "";
          default:
            return "";
        }
      },
      [existingCostCenters]
    );

    const handleInputChange = useCallback(
      (field: keyof typeof newCostCenter) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;

          setNewCostCenter((prev) => ({ ...prev, [field]: value }));

          const error = validateField(field, value);
          setErrors((prev) => ({ ...prev, [field]: error }));
        },
      [validateField]
    );

    const focusNextElement = useCallback(() => {
      const refs = [
        codigoRef,
        nombreRef,
        checkboxRef, // Checkbox como botón
        submitButtonRef,
      ];

      const currentElement = document.activeElement;

      const currentIndex = refs.findIndex(
        (ref) =>
          ref.current === currentElement ||
          ref.current?.contains(currentElement as Node)
      );

      if (currentIndex !== -1 && currentIndex < refs.length - 1) {
        const nextRef = refs[currentIndex + 1];

        if (nextRef?.current instanceof HTMLElement) {
          // Si es el Checkbox, haz foco explícito
          nextRef.current.focus();
        } else if (nextRef?.current) {
          // Manejo seguro para otros elementos
          (nextRef.current as HTMLElement).focus();
        }
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
        codigo: validateField("codigo", newCostCenter.codigo),
        nombre: validateField("nombre", newCostCenter.nombre),
      };

      setErrors(newErrors);

      if (Object.values(newErrors).some((error) => error !== "")) {
        return;
      }

      onSubmit(newCostCenter);
      setNewCostCenter({
        codigo: "",
        nombre: "",
        activo: true,
        empresa_id: selectedEmpresa.id
      });
      setErrors({ codigo: "", nombre: "" });
    }, [newCostCenter, onSubmit, validateField]);

    return (
      <TableRow>
        <TableCell>
          <TextField
            inputRef={codigoRef}
            placeholder="Nuevo código"
            value={newCostCenter.codigo}
            onChange={handleInputChange("codigo")}
            autoFocus
            variant="outlined"
            fullWidth
            size="small"
            error={!!errors.codigo}
            helperText={errors.codigo}
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
            value={newCostCenter.nombre}
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
        <TableCell align="center">
          <Checkbox
            ref={checkboxRef}
            tabIndex={0} // Hace que el contenedor del Checkbox sea parte del flujo de tabulación
            checked={newCostCenter.activo}
            onChange={(e, checked) => {
              setNewCostCenter((prev) => ({
                ...prev,
                activo: checked,
              }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                focusNextElement();
              }
            }}
            onFocus={() => {
              // Enfoca manualmente el checkbox
              checkboxRef.current?.focus();
            }}
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

export default CostCenterForm;
