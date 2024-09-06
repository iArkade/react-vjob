import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DataTable, type ColumnDef } from '@/components/core/data-table';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { addFetchedRows, addRow, updateRow } from '@/state/slices/tableSlice';
import { v4 as uuidv4 } from 'uuid';
import { useCreateAccountingPlan, useGetAccountingPlan } from '@/api/accounting_plan/accountRequest';

interface Row {
  id: string;
  code: string;
  description: string;
  isNew?: boolean;
  isEdited?: boolean;
}

export function Page(): React.JSX.Element {
  const dispatch = useDispatch();
  const { mutateAsync: save_data } = useCreateAccountingPlan();
  const rows = useSelector((state: RootState) => state.tableSlice.rows);

  console.log(rows);
  

  // Usar React Query para obtener los datos
  const { data: fetchedRows = [], isLoading, isError, error } = useGetAccountingPlan();

  React.useEffect(() => {
    if (fetchedRows) {
      dispatch(addFetchedRows(fetchedRows)); // Use new action to add fetched rows
    }
  }, [fetchedRows, dispatch]);

  const columns = [
    {
      field: 'code',
      name: 'Code',
      formatter: (row: Row, index: number) => (
        <input
          type="text"
          value={row.code || ''}
          onChange={(e) => handleChange(e, index, 'code')}
        />
      ),
      width: '150px',
    },
    {
      field: 'description',
      name: 'Description',
      formatter: (row: Row, index: number) => (
        <input
          type="text"
          value={row.description || ''}
          onChange={(e) => handleChange(e, index, 'description')}
        />
      ),
      width: '250px',
    },
  ] satisfies ColumnDef<Row>[];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Row) => {
    dispatch(updateRow({ index, field, value: e.target.value }));
  };
  

  const handleAddRow = () => {
    dispatch(addRow({ id: uuidv4(), code: '', description: '', isNew: true }));
  };
  

  const handleSubmit = async () => {
    try {
      // Filter only new or edited rows
      const newOrEditedRows = rows.filter(row => row.isNew || row.isEdited);
  
      // Remove the `id`, `isNew`, and `isEdited` fields
      const sanitizedRows = newOrEditedRows.map(({ id, isNew, isEdited, ...rest }) => rest);

      console.log(sanitizedRows);
      
  
      // Save only the sanitized rows
      await Promise.all(sanitizedRows.map(row => save_data(row)));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {error instanceof Error ? error.message : 'Unknown error'}</Typography>;

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Analytics</Typography>
            </Box>
            <div>
              <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddRow}>
                Add Row
              </Button>
            </div>
          </Stack>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Data Table</Typography>
            <DataTable<Row>
              columns={columns}
              rows={rows}
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
              Save to Database
            </Button>
          </Box>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
