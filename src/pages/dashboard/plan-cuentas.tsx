import { useState } from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import AccountingPlanTable from '@/components/accountingPlan/accounting-table';
import ExcelUpload from '@/components/accountingPlan/excel-upload';

export function PlanCuentas(): React.JSX.Element {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>PLAN DE CUENTAS</Typography>
      <ExcelUpload onSuccessfulUpload={handleDataRefresh} />
      <AccountingPlanTable refreshTrigger={refreshTrigger} />
    </Box>
  );
}

export default PlanCuentas;