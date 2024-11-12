import React, { useState, useCallback, memo, useEffect } from "react";
import { TableRow, TableCell, TextField, IconButton, Checkbox } from "@mui/material";
import { FloppyDisk, Trash } from "@phosphor-icons/react";
import { TransaccionContableResponseType } from "@/api/transaccion_contable/transaccion-contable.types";

interface TransactionRowProps {
    transaction: TransaccionContableResponseType;
    onUpdate: (id: number, data: { codigo_transaccion: string; nombre: string; secuencial: string; lectura: number; activo: boolean }) => void;
    onDelete: (codigo_transaccion: string) => void;
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
                editingCode !== transaction.codigo_transaccion ||
                editingName !== transaction.nombre ||
                editingSecuencial !== (transaction.secuencial?.padStart(9, "0") || "000000001") ||
                editingLectura !== transaction.lectura ||
                editingActivo !== transaction.activo
            );
        }, [editingCode, editingName, editingSecuencial, editingLectura, editingActivo, transaction]);

        const handleSave = useCallback(() => {
            onUpdate(transaction.id, {
                codigo_transaccion: editingCode,
                nombre: editingName,
                secuencial: editingSecuencial,
                lectura: editingLectura,              
                activo: editingActivo,
            });
            setIsChanged(false);
        }, [transaction.id, onUpdate, editingCode, editingName, editingSecuencial, editingLectura, editingActivo]);

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
                    <IconButton onClick={() => onDelete(transaction.codigo_transaccion)}>
                        <Trash size={20} />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }
);

export default TransactionRow;
