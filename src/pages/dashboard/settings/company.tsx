import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CompanyDetails } from '@/components/dashboard/settings/company-details';


export function Company(): React.JSX.Element {
     return (
          <React.Fragment>
               <Stack spacing={4}>
                    <div>
                         <Typography variant="h4">Empresa</Typography>
                    </div>
                    <Stack spacing={4}>
                         <CompanyDetails />
                    </Stack>
               </Stack>
          </React.Fragment>
     );
}
