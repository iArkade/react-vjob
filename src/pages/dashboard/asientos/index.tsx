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
import { Asiento } from '@/api/asientos/asientos-types';
import { useAsientos } from '@/api/asientos/asientos-request';
import AsientoDetailsModal from '@/components/dashboard/asientos/asiento-detail-modal';
import { useSearchParams } from 'react-router-dom';

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
     const [selectedAsiento, setSelectedAsiento] = React.useState<Asiento | null>(null);
     const [openModal, setOpenModal] = React.useState(false);

     const { data: asientos, isLoading, isError } = useAsientos();
     const [searchParams, setSearchParams] = useSearchParams();

     const handleOpenModal = (asiento: Asiento) => {
          if (asiento && asiento.id) { // Verifica que asiento e id estén definidos
               setSelectedAsiento(asiento);
               setOpenModal(true);
               setSearchParams({ previewId: asiento.id.toString() }); // Agrega el ID del asiento como previewId en la URL
          }
     };

     const handleCloseModal = () => {
          setSelectedAsiento(null);
          setOpenModal(false);
          searchParams.delete('previewId');  // Remueve `previewId` del URL
          setSearchParams(searchParams);
     };

     // React.useEffect(() => {
     //      const previewId = searchParams.get('previewId');
     //      if (previewId && asientos) {
     //           // Busca el asiento correspondiente en los datos, asegurándose de que `a.id` esté definido
     //           const asiento = asientos.find((a) => a.id !== undefined && a.id.toString() === previewId);
     //           if (asiento) {
     //                setSelectedAsiento(asiento);
     //                setOpenModal(true);
     //           }
     //      }
     // }, [searchParams, asientos]);

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
                                        <AsientoTable 
                                             asientos={asientos}        // Pasamos los datos
                                             isLoading={isLoading}      // Estado de carga
                                             isError={isError}          // Estado de error
                                             onOpenModal={handleOpenModal} // Pasamos la función de apertura del modal
                                        />
                                   </Box>
                                   <Divider />
                              </Card>
                    </Stack>
               </Box>
               <AsientoDetailsModal
                    open={openModal}
                    onClose={handleCloseModal}
                    asiento={selectedAsiento}
               />
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

