import React, { useState, useCallback, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    TextField,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert,
    Box,
    IconButton,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

// Types for our props and data
export interface Column {
    id: string;
    label: string;
    width?: string;
    searchable?: boolean;
    render?: (value: any) => React.ReactNode;
}

interface GenericTableProps {
    columns: Column[];
    data: any[];
    totalItems: number;
    isLoading?: boolean;
    error?: string;
    success?: string;
    onAdd: (newItem: any) => Promise<void>;
    onUpdate: (id: any, updatedItem: any) => Promise<void>;
    onDelete: (id: any) => Promise<void>;
    FormComponent: React.ComponentType<{
        onSubmit: (data: any) => void;
        initialData?: any;
    }>;
    RowComponent: React.ComponentType<{
        data: any;
        columns: Column[];
        onUpdate: (id: any, data: any) => void;
        onDelete: (id: any) => void;
        isSelected: boolean;
        onRowClick: (id: any) => void;
    }>;
}

const GenericTable: React.FC<GenericTableProps> = ({
    columns,
    data,
    totalItems,
    isLoading,
    error,
    success,
    onAdd,
    onUpdate,
    onDelete,
    FormComponent,
    RowComponent
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [messages, setMessages] = useState({ error: '', success: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const searchableColumns = useMemo(() =>
        columns.filter(column => column.searchable),
        [columns]
    );

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;

        return data.filter(item => {
            return searchableColumns.some(column => {
                const value = item[column.id];
                if (value == null) return false;
                return value.toString().toLowerCase()
                    .includes(searchQuery.toLowerCase());
            });
        });
    }, [data, searchQuery, searchableColumns]);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleEdit = useCallback((id: number) => {
        setEditingId(prevId => prevId === id ? null : id);
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await onDelete(id);
            setMessages({ error: '', success: 'Item deleted successfully' });
        } catch (err) {
            setMessages({ error: 'Error deleting item', success: '' });
        }
    }, [onDelete]);

    const handleSubmit = useCallback(async (data: any) => {
        try {
            if (editingId) {
                await onUpdate(editingId, data);
                setEditingId(null);
                setMessages({ error: '', success: 'Item updated successfully' });
            } else {
                await onAdd(data);
                setMessages({ error: '', success: 'Item added successfully' });
            }
        } catch (err) {
            setMessages({ error: 'Error saving item', success: '' });
        }
    }, [editingId, onAdd, onUpdate]);

    const clearMessages = () => setMessages({ error: '', success: '' });
    const clearSearch = () => setSearchQuery('');

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {searchableColumns.length > 0 && (
                <Box sx={{ p: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={`Search by ${searchableColumns.map(col => col.label).join(', ')}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton onClick={clearSearch} size="small">
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            )}

            <Table size="medium" stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                sx={{ width: column.width }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell sx={{ width: '120px' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                            <FormComponent
                                onSubmit={handleSubmit}
                                initialData={null}
                            />
                        </TableCell>
                    </TableRow>

                    {filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                            <RowComponent
                                key={row.id}
                                data={row}
                                columns={columns}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                isSelected={editingId === row.id}
                                onRowClick={handleEdit}
                            />
                        ))}

                    {filteredData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} align="center">
                                No records found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Snackbar
                open={!!messages.error || !!messages.success}
                autoHideDuration={6000}
                onClose={clearMessages}
            >
                <Alert
                    severity={messages.error ? "error" : "success"}
                    onClose={clearMessages}
                    sx={{ width: '100%' }}
                >
                    {messages.error || messages.success}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default GenericTable;