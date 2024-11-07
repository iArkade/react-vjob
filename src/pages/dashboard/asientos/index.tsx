import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import AsientoTable from '@/components/dashboard/asientos/asientos-table';
import { RouterLink } from '@/components/core/link';
import { paths } from '@/paths';

// import { useSearchParams } from 'react-router-dom';

// import { config } from '@/config';
// import { dayjs } from '@/lib/dayjs';
// import { OrderModal } from '@/components/dashboard/order/order-modal';
// import { OrdersFilters } from '@/components/dashboard/order/orders-filters';
// import type { Filters } from '@/components/dashboard/order/orders-filters';
// import { OrdersPagination } from '@/components/dashboard/order/orders-pagination';
// import { OrdersSelectionProvider } from '@/components/dashboard/order/orders-selection-context';
// import type { Order } from '@/components/dashboard/order/orders-table';


export function Page(): React.JSX.Element {
     // const { customer, id, previewId, sortDir, status } = useExtractSearchParams();

     // const sortedOrders = applySort(orders, sortDir);

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
                                   <Typography variant="h4">Asientos</Typography>
                              </Box>
                              <div>
                                   <Button 
                                        component={RouterLink}
                                        href={paths.dashboard.asientos.create}
                                        startIcon={<PlusIcon />} 
                                        variant="contained"
                                   >
                                        Asiento Diario
                                   </Button>
                              </div>
                         </Stack>
                              <Card>
                                   <Box sx={{ overflowX: 'auto' }}>
                                        <AsientoTable />
                                   </Box>
                                   <Divider />
                              </Card>
                    </Stack>
               </Box>
               {/* <OrderModal open={Boolean(previewId)} /> */}
          </React.Fragment>
     );
}

// function useExtractSearchParams(): {
//      customer?: string;
//      id?: string;
//      previewId?: string;
//      sortDir?: 'asc' | 'desc';
//      status?: string;
// } {
//      const [searchParams] = useSearchParams();

//      return {
//           customer: searchParams.get('customer') || undefined,
//           id: searchParams.get('id') || undefined,
//           previewId: searchParams.get('previewId') || undefined,
//           sortDir: (searchParams.get('sortDir') || undefined) as 'asc' | 'desc' | undefined,
//           status: searchParams.get('status') || undefined,
//      };
// }

