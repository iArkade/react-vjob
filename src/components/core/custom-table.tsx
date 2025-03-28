import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { FloppyDisk as SaveIcon } from '@phosphor-icons/react';
import { UseQueryResult } from 'react-query';

export interface CustomColumn<T> {
    name: string;
    field: keyof T;
}

export interface CustomRow {
    [key: string]: any;
}

interface CustomTableProps<T extends CustomRow> {
    columns: CustomColumn<T>[];
    title: string;
    fetchData: () => UseQueryResult<T[], unknown>;
    onSaveNewRows: (newRows: Partial<T>[]) => Promise<void>;
    editableFields: (keyof T)[];
    visibleFields: (keyof T)[];
}

export function CustomTable<T extends CustomRow>({
    columns,
    title,
    fetchData,
    onSaveNewRows,
    editableFields,
    visibleFields,
}: CustomTableProps<T>): React.ReactElement {
    const { data: fetchedRows, isLoading, isError, error } = fetchData();
    const [rows, setRows] = useState<T[]>([]);
    const [newRows, setNewRows] = useState<Partial<T>[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (fetchedRows) {
            setRows(fetchedRows);
        }
    }, [fetchedRows]);

    const addEmptyRow = () => {
        const newRow = editableFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}) as Partial<T>;
        setNewRows((prevRows) => [...prevRows, newRow]);
    };

    const handleCellChange = (rowIndex: number, field: keyof T, value: string) => {
        setNewRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
            return updatedRows;
        });
    };

    const handleSaveNewRows = async () => {
        setIsSaving(true);
        try {
            await onSaveNewRows(newRows);
            setRows((prevRows) => [...prevRows, ...newRows as T[]]);
            setNewRows([]);
        } catch (err) {
            console.error("Error saving new rows:", err);
            // You might want to show an error message to the user here
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <CircularProgress />
            </Box>
        );
    }


    if (isError) {
        return <Alert severity="error">Error: {(error as Error).message}</Alert>;
    }

    const visibleColumns = columns.filter(column => visibleFields.includes(column.field));

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h4" sx={{ flex: '1 1 auto' }}>{title}</Typography>
                <Button startIcon={<PlusIcon />} variant="contained" onClick={addEmptyRow}>
                    Add Row
                </Button>
                {newRows.length > 0 && (
                    <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        onClick={handleSaveNewRows}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save New Rows'}
                    </Button>
                )}
            </Stack>

            <Table>
                <TableHead>
                    <TableRow>
                        {visibleColumns.map((column) => (
                            <TableCell key={String(column.field)}>{column.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {visibleColumns.map((column) => (
                                <TableCell key={`${rowIndex}-${String(column.field)}`}>{row[column.field]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {newRows.map((row, rowIndex) => (
                        <TableRow key={`new-row-${rowIndex}`}>
                            {visibleColumns.map((column) => (
                                <TableCell key={`new-${rowIndex}-${String(column.field)}`}>
                                    <TextField
                                        value={row[column.field] || ''}
                                        onChange={(e) => handleCellChange(rowIndex, column.field, e.target.value)}
                                        fullWidth
                                        disabled={!editableFields.includes(column.field)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}