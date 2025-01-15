import React, { useState, useCallback, memo, useEffect } from "react";
import { TableRow, TableCell, TextField, IconButton, Checkbox } from "@mui/material";
import { FloppyDisk, Trash } from "@phosphor-icons/react";
import { TransaccionContableResponseType } from "@/api/transaccion_contable/transaccion-contable-types";
import Swal from "sweetalert2";

interface TransactionRowProps {
    transaction: TransaccionContableResponseType;
    onUpdate: (
        id: number,
        data: { codigo_transaccion: string; nombre: string; secuencial: string; lectura: number; activo: boolean; empresa_id: number },
        empresa_id: number
    ) => Promise<{ success: boolean; error?: string }>;
    onDelete: (codigo_transaccion: string, empresa_id: number) => Promise<{ success: boolean; error?: string }>;
    isSelected: boolean;
    onRowClick: (id: number) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = memo(
    ({ transaction, onUpdate, onDelete, isSelected, onRowClick }) => {
        const [editingCode, setEditingCode] = useState(transaction.codigo_transaccion);
        const [editingName, setEditingName] = useState(transaction.nombre);
        const [editingSecuencial, setEditingSecuencial] = useState(
            transaction.secuencial?.padStart(9, "0") || "000000001"
        );
        const [editingLectura, setEditingLectura] = useState(transaction.lectura);
        const [editingActivo, setEditingActivo] = useState(transaction.activo);

        const [originalCode, setOriginalCode] = useState(transaction.codigo_transaccion);
        const [originalName, setOriginalName] = useState(transaction.nombre);
        const [originalSecuencial, setOriginalSecuencial] = useState(transaction.secuencial);
        const [originalLectura, setOriginalLectura] = useState(transaction.lectura);
        const [originalActivo, setOriginalActivo] = useState(transaction.activo);

        const [isChanged, setIsChanged] = useState(false);
        const [isDarkTheme, setIsDarkTheme] = useState(false);
        const [isEditing, setIsEditing] = useState(false);
        const [errorMessage, setErrorMessage] = useState<string | null>(null);

        useEffect(() => {
            const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
            setIsDarkTheme(darkThemeMq.matches);

            const themeChangeListener = (e: MediaQueryListEvent) => {
                setIsDarkTheme(e.matches);
            };

            darkThemeMq.addEventListener("change", themeChangeListener);
            return () => darkThemeMq.removeEventListener("change", themeChangeListener);
        }, []);

        useEffect(() => {
            setIsChanged(
                editingCode !== transaction.codigo_transaccion ||
                editingName !== transaction.nombre ||
                editingSecuencial !== (transaction.secuencial?.padStart(9, "0") || "000000001") ||
                editingLectura !== transaction.lectura ||
                editingActivo !== transaction.activo
            );
        }, [editingCode, editingName, editingSecuencial, editingLectura, editingActivo, transaction]);

        const restoreOriginalValues = useCallback(() => {
            setEditingCode(originalCode);
            setEditingName(originalName);
            setEditingSecuencial(originalSecuencial);
            setEditingLectura(originalLectura);
            setEditingActivo(originalActivo);
            setIsChanged(false);
            setIsEditing(false);
            setErrorMessage(null);
        }, [originalCode, originalName, originalSecuencial, originalLectura, originalActivo]);

        const handleSave = useCallback(async () => {
            if (isChanged) {

                // Validación de nombre no vacío
                if (!editingName || editingName.trim() === "") {
                    setErrorMessage("El nombre no puede estar vacío");
                    restoreOriginalValues();
                    return;
                }

                // Validación de codigo no vacío
                if (!editingCode || editingCode.trim() === "") {
                    setErrorMessage("El codigo no puede estar vacío");
                    restoreOriginalValues();
                    return;
                }

                Swal.fire({
                    title: "¿Está seguro?",
                    text: "Desea actualizar el campo",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí",
                    cancelButtonText: "Cancelar",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const updateResult = await onUpdate(
                                transaction.id,
                                {
                                    codigo_transaccion: editingCode,
                                    nombre: editingName,
                                    secuencial: editingSecuencial,
                                    lectura: editingLectura,
                                    activo: editingActivo,
                                    empresa_id: transaction.empresa_id,
                                },
                                transaction.empresa_id,
                            );
                            if (updateResult.success) {
                                // Actualización exitosa
                                setOriginalCode(editingCode);
                                setOriginalName(editingName);
                                setOriginalSecuencial(editingSecuencial);
                                setOriginalLectura(editingLectura);
                                setOriginalActivo(editingActivo);

                                setIsChanged(false);
                                setIsEditing(false);

                                Swal.fire({
                                    title: "Actualizado",
                                    text: "El campo ha sido actualizado correctamente",
                                    icon: "success",
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                            } else {
                                // Error en la actualización
                                setErrorMessage(updateResult.error || "Error al actualizar");
                                restoreOriginalValues();

                                Swal.fire({
                                    title: "Error",
                                    text: updateResult.error || "No se pudo actualizar",
                                    icon: "error",
                                });
                            }
                        } catch (error) {
                            // Error inesperado
                            setErrorMessage("Error inesperado");
                            restoreOriginalValues();

                            Swal.fire({
                                title: "Error",
                                text: "Ha ocurrido un error inesperado",
                                icon: "error",
                            });
                        }
                    } else {
                        // User clicked cancel, restore original values
                        restoreOriginalValues();
                    }
                });
            }
        }, [isChanged, restoreOriginalValues, transaction.id, onUpdate, editingCode, editingName, editingSecuencial, editingLectura, editingActivo, transaction.empresa_id]);

        const handleDelete = useCallback(
            (codigo_transaccion: string, empresa_id: number) => {
                Swal.fire({
                    title: '¿Está seguro?',
                    text: 'Esta acción eliminará el elemento de forma permanente.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const deleteResult = await onDelete(codigo_transaccion, empresa_id);

                            if (deleteResult.success) {
                                Swal.fire({
                                    title: 'Eliminado',
                                    text: 'El elemento ha sido eliminado correctamente.',
                                    icon: 'success',
                                    timer: 2000,
                                    showConfirmButton: false,
                                })
                            } else {
                                // Error en la eliminacion
                                setErrorMessage(deleteResult.error || "Error al eliminar");
                                restoreOriginalValues();

                                Swal.fire({
                                    title: "Error",
                                    text: deleteResult.error || "No se pudo eliminar",
                                    icon: "error",
                                });
                            }
                        } catch (error) {
                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo eliminar el elemento.',
                                icon: 'error',
                            });
                        }
                    }
                });
            },
            [onDelete]
        );

        const handleSequentialChange = (value: string) => {
            // Limit input to numbers only, then limit to a maximum of 9 digits
            const formattedValue = value.replace(/[^0-9]/g, "").padStart(9, "0").slice(-9);
            setEditingSecuencial(formattedValue);
        };


        const handleActivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setEditingActivo(e.target.checked);
        };

        return (
            <TableRow
                hover
                selected={isSelected}
                onClick={() => onRowClick(transaction.id)}
                sx={{ cursor: "pointer" }}
                style={{
                    backgroundColor: isSelected
                        ? isDarkTheme
                            ? "#2b2a2a"
                            : "#d3d3d3"
                        : "inherit",
                    cursor: "pointer",
                }}
            >
                <TableCell>
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
                    <TextField
                        value={editingSecuencial}
                        onChange={(e) => handleSequentialChange(e.target.value)}
                        onBlur={() => {
                            // Reset to "000000001" if the input is empty or invalid (not exactly 9 digits)
                            if (!/^[0-9]{9}$/.test(editingSecuencial)) {
                                setEditingSecuencial("000000001");
                            }
                        }}
                        variant="standard"
                        fullWidth
                    />
                </TableCell>
                <TableCell align="center">
                    <TextField
                        type="number"
                        value={editingLectura}
                        onChange={(e) => setEditingLectura(Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        variant="standard"
                        inputProps={{ min: 0, max: 1 }}
                        size="small"
                    />
                </TableCell>
                <TableCell align="center">
                    <Checkbox
                        checked={editingActivo}
                        onChange={handleActivoChange}
                        onClick={(e) => e.stopPropagation()}
                    />
                </TableCell>
                <TableCell>
                    <IconButton onClick={handleSave} disabled={!isChanged}>
                        <FloppyDisk size={20} weight={isChanged ? "bold" : "regular"} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(transaction.codigo_transaccion, transaction.empresa_id)}>
                        <Trash size={20} />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
);

export default TransactionRow;
