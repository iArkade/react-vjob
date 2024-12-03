import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import AccountingPlanTable from '@/components/accountingPlan/accounting-table';
import ExcelUpload from '@/components/accountingPlan/excel-upload';

export function Page(): React.JSX.Element {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>PLAN DE CUENTAS</Typography>
      <ExcelUpload />
      <AccountingPlanTable />
    </Box>
  );
}

export default Page;