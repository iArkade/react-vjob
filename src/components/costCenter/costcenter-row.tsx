import React, { useState, useCallback, memo, useEffect } from "react";
import { TableRow, TableCell, TextField, IconButton, Checkbox } from "@mui/material";
import { FloppyDisk, Trash } from "@phosphor-icons/react";
import { CentroCostoResponseType } from "@/api/centro_costo/centro-costo.types";
import Swal from "sweetalert2";

interface CostCenterRowProps {
    costCenter: CentroCostoResponseType;
    onUpdate: (
        id: number,
        data: { codigo: string; nombre: string; activo: boolean; empresa_id: number },
        empresa_id: number
    ) => Promise<{ success: boolean; error?: string }>;
    onDelete: (codigo: string, empresa_id: number) => Promise<{ success: boolean; error?: string }>;
    isSelected: boolean;
    onRowClick: (id: number) => void;
}

const CostCenterRow: React.FC<CostCenterRowProps> = memo(
    ({ costCenter, onUpdate, onDelete, isSelected, onRowClick }) => {
        const [editingCode, setEditingCode] = useState(costCenter.codigo);
        const [editingName, setEditingName] = useState(costCenter.nombre);
        const [editingActivo, setEditingActivo] = useState(costCenter.activo);

        const [originalCode, setOriginalCode] = useState(costCenter.codigo);
        const [originalName, setOriginalName] = useState(costCenter.nombre);
        const [originalActivo, setOriginalActivo] = useState(costCenter.activo);

        const [isChanged, setIsChanged] = useState(false);
        const [isDarkTheme, setIsDarkTheme] = useState(false);
        const [errorMessage, setErrorMessage] = useState<string | null>(null);
        const [isEditing, setIsEditing] = useState(false);

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
                editingCode !== costCenter.codigo ||
                editingName !== costCenter.nombre ||
                editingActivo !== costCenter.activo
            );
        }, [editingCode, editingName, editingActivo, costCenter]);

        const restoreOriginalValues = useCallback(() => {
            setEditingCode(originalCode);
            setEditingName(originalName);
            setEditingActivo(originalActivo);
            setIsChanged(false);
            setIsEditing(false);
            setErrorMessage(null);
        }, [originalCode, originalName, originalActivo]);

        const handleSave = useCallback(async () => {
            if (isChanged) {

                // Validación de nombre no vacío
                if (!editingName || editingName.trim() === "") {
                    setErrorMessage("El nombre no puede estar vacío");
                    restoreOriginalValues();
                    return;
                }

                // Validación de nombre no vacío
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
                                costCenter.id,
                                {
                                    codigo: editingCode,
                                    nombre: editingName,
                                    activo: editingActivo,
                                    empresa_id: costCenter.empresa_id,
                                },
                                costCenter.empresa_id,
                            );
                            if (updateResult.success) {
                                // Actualización exitosa
                                setOriginalCode(editingCode);
                                setOriginalName(editingName);
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
        }, [isChanged, costCenter.id, onUpdate, editingCode, editingName, editingActivo, costCenter.empresa_id, restoreOriginalValues]);


        const handleDelete = useCallback(
            (codigo: string, empresa_id: number) => {
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
                            const deleteResult = await onDelete(codigo, empresa_id);
                            if (deleteResult.success) {
                                Swal.fire({
                                    title: 'Eliminado',
                                    text: 'El elemento ha sido eliminado correctamente.',
                                    icon: 'success',
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
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

        const handleActivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setEditingActivo(e.target.checked);
        };

        return (
            <TableRow
                hover
                selected={isSelected}
                onClick={() => onRowClick(costCenter.id)}
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
                    <IconButton onClick={() => handleDelete(costCenter.codigo, costCenter.empresa_id)}>
                        <Trash size={20} />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
);

export default CostCenterRow;
