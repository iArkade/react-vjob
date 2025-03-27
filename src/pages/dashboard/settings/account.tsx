import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AccountDetails } from '@/components/dashboard/settings/account-details';

// import { DeleteAccount } from '@/components/dashboard/settings/delete-account';
// import { Privacy } from '@/components/dashboard/settings/privacy';
// import { ThemeSwitch } from '@/components/dashboard/settings/theme-switch';

export function Account(): React.JSX.Element {
     return (
          <React.Fragment>
               <Stack spacing={4}>
                    <div>
                         <Typography variant="h4">Cuenta</Typography>
                    </div>
                    <Stack spacing={4}>
                         <AccountDetails />
                         {/* <ThemeSwitch />
                         <Privacy />
                         <DeleteAccount /> */}
                    </Stack>
               </Stack>
          </React.Fragment>
     );
}

