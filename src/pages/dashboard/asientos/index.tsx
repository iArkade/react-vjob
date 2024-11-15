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
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Page(): React.JSX.Element {

     const [selectedAsiento, setSelectedAsiento] = React.useState<Asiento | null>(null);
     const [openModal, setOpenModal] = React.useState(false);

     const { data: asientos, isLoading, isError, refetch } = useAsientos();
     const [searchParams, setSearchParams] = useSearchParams();
     const navigate = useNavigate();

     const handleOpenModal = (asiento: Asiento) => {
          if (asiento?.id) {
               setSelectedAsiento(asiento);
               setOpenModal(true);
               navigate(`/dashboard/asientos?previewId=${asiento.id}`);
          }
     };

     const handleCloseModal = () => {
          setSelectedAsiento(null);
          setOpenModal(false);
          navigate('/dashboard/asientos');
     };

     React.useEffect(() => {
          const previewId = searchParams.get('previewId');

          // Si hay un previewId en la URL y tenemos asientos cargados
          if (previewId && asientos?.length && !openModal) { // Añadimos !openModal para evitar loops
               const asiento = asientos.find(a => a?.id?.toString() === previewId);

               if (asiento) {
                    setSelectedAsiento(asiento);
                    setOpenModal(true);
               } else {
                    //console.error(`Asiento con ID ${previewId} no encontrado.`);
                    navigate('/dashboard/asientos');
               }
          }
     }, [searchParams, asientos, openModal]);


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
                                        refetch = {refetch}
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
                    previewId={searchParams.get('previewId') || ''}
               />
          </React.Fragment>
     );
}

