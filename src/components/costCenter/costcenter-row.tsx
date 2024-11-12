import React, { useState, useCallback, memo, useEffect } from "react";
import { TableRow, TableCell, TextField, IconButton, Checkbox } from "@mui/material";
import { FloppyDisk, Trash } from "@phosphor-icons/react";
import { CentroCostoResponseType } from "@/api/centro_costo/centro-costo.types";

interface CostCenterRowProps {
    costCenter: CentroCostoResponseType;
    onUpdate: (id: number, data: { codigo: string; nombre: string; activo: boolean }) => void;
    onDelete: (codigo: string) => void;
    isSelected: boolean;
    onRowClick: (id: number) => void;
}

const CostCenterRow: React.FC<CostCenterRowProps> = memo(
    ({ costCenter, onUpdate, onDelete, isSelected, onRowClick }) => {
        const [editingCode, setEditingCode] = useState(costCenter.codigo);
        const [editingName, setEditingName] = useState(costCenter.nombre);
        const [editingActivo, setEditingActivo] = useState(costCenter.activo);
        const [isChanged, setIsChanged] = useState(false);
        const [isDarkTheme, setIsDarkTheme] = useState(false);

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

        const handleSave = useCallback(() => {
            onUpdate(costCenter.id, {
                codigo: editingCode,
                nombre: editingName,            
                activo: editingActivo,
            });
            setIsChanged(false);
        }, [costCenter.id, onUpdate, editingCode, editingName, editingActivo]);


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
                    <IconButton onClick={() => onDelete(costCenter.codigo)}>
                        <Trash size={20} />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
);

export default CostCenterRow;
