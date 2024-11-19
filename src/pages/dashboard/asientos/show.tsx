// Page.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AsientosForm } from '../../../components/dashboard/asientos/asientos-form';
import { useAsiento } from '@/api/asientos/asientos-request';
import { useParams } from 'react-router-dom';

export function Page(): React.JSX.Element {
     const { id } = useParams<{ id: string }>();
     const asientoId = id ? parseInt(id, 10) : undefined;

     const { data: asiento, isLoading, isError } = useAsiento(asientoId as number);
     //console.log(asiento, asientoId);
     const transformedAsiento = asiento
          ? {
               ...asiento,
               fecha_emision: new Date(asiento.fecha_emision),
               lineItems: asiento.lineItems
                    ? asiento.lineItems.map((item) => ({
                         id_asiento_item: item.id_asiento_item || '',
                         codigo_centro: item.codigo_centro || '',
                         cta: item.cta || '',
                         cta_nombre: item.cta_nombre || '',
                         debe: item.debe || 0,
                         haber: item.haber || 0,
                         nota: item.nota || '',
                    }))
                    : [],
          }
          : undefined;


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
                         {!isLoading && !isError && asiento && (
                              <AsientosForm asiento={transformedAsiento} />
                         )}
                    </Stack>
               </Box>
          </React.Fragment>
     );
}
