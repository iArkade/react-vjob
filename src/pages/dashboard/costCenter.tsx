import React from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import CostCenterTable from '@/components/costCenter/costcenter-table';

export function CostCenter(): React.JSX.Element {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Centro de Costos</Typography>
            <CostCenterTable />
        </Box>
    );
}

export default CostCenter;