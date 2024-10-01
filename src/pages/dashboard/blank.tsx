import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import AccountingPlanTable from '@/components/accountingPlan/accounting-table';

export function Page(): React.JSX.Element {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>PLAN DE CUENTAS</Typography>
      <AccountingPlanTable />
    </Box>
  );
}

export default Page;