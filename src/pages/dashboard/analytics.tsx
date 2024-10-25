import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CustomTable, CustomColumn } from '@/components/core/custom-table';
import { useGetAccountingPlan, useCreateAccountingPlan } from '@/api/accounting-plan/account-request';
import { AccountingPlanRequestType,  AccountingPlanResponseType} from '@/api/accounting-plan/account-types';
import { UseQueryResult } from 'react-query';

// Definimos AccountingPlanRow para que coincida con AccountingPlanResponseType
type AccountingPlanRow = AccountingPlanResponseType;

export function Page(): React.JSX.Element {
  const columns: CustomColumn<AccountingPlanRow>[] = [
    { name: 'Code', field: 'code' },
    { name: 'Name', field: 'name' },
    { name: 'Created_At', field: 'createdAt' },
  ];

  const createAccountingPlan = useCreateAccountingPlan();

  const saveNewRows = async (newRows: Partial<AccountingPlanRow>[]) => {
    for (const row of newRows) {
      // Asegúrate de que los campos requeridos estén presentes
      if (row.code && row.name) {
        const newRow: AccountingPlanRequestType = {
          code: row.code,
          name: row.name,
          // Añade aquí otros campos requeridos si los hay
        };
        await createAccountingPlan.mutateAsync(newRow);
      } else {
        console.error('Missing required fields in row:', row);
      }
    }
    console.log('Saving new rows:', newRows);
  };

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <CustomTable<AccountingPlanRow>
          columns={columns}
          title="Accounting Plan"
          fetchData={useGetAccountingPlan as () => UseQueryResult<AccountingPlanRow[], unknown>}
          onSaveNewRows={saveNewRows}
          editableFields={['code', 'name']}
          visibleFields={['code', 'name', 'createdAt']}
        />
      </Stack>
    </Box>
  );
}