import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AsientosForm } from '../../components/dashboard/asientos/asientos-form';

export function Page(): React.JSX.Element {
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
                         <Stack spacing={3}>
                              <div>
                                   <Typography variant="h4">Asiento Diario Contable</Typography>
                              </div>
                         </Stack>
                         <AsientosForm /> 
                    </Stack>
               </Box>
          </React.Fragment>
     );
}
