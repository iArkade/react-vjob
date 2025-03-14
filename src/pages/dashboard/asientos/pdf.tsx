import * as React from 'react';

import { PDFViewer } from '@react-pdf/renderer';
import { AsientoPDFDocument } from '@/components/dashboard/asientos/asientos-pdf-document';
import { useParams } from 'react-router-dom';
import { useAsiento } from '@/api/asientos/asientos-request';
import { useGetCentroCosto } from '@/api/centro_costo/centro-costo-request';
import { useGetTransaccionContable } from '@/api/transaccion_contable/transaccion-contable-request';
import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import { RouterLink } from '@/components/core/link';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

export function AsientosPDF(): React.JSX.Element {
     const { id } = useParams<{ id: string }>();
     const asientoId = id ? parseInt(id, 10) : undefined;
     const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);

     const { data: asiento } = useAsiento(asientoId as number, selectedEmpresa.id);
     const { data: centros = [] } = useGetCentroCosto(selectedEmpresa.id);
     const { data: transacciones = [] } = useGetTransaccionContable(selectedEmpresa.id);

     if (!asiento) {
          return <div>Cargando asiento...</div>;

     }
     const transformedAsiento = {
          ...asiento,
          codigo_transaccion: transacciones.find(
               (t) => t.codigo_transaccion === asiento.codigo_transaccion
          )?.nombre || asiento.codigo_transaccion, // Mostrar el nombre si existe, de lo contrario el código

          codigo_centro: centros.find(
               (c) => c.codigo === asiento.codigo_centro
          )?.nombre || asiento.codigo_centro, // Mostrar el nombre si existe, de lo contrario el código

          lineItems: asiento.lineItems.map((item) => {
               const itemCentro = centros.find((c) => c.codigo === item.codigo_centro);
               return {
                    ...item,
                    codigo_centro: itemCentro ? itemCentro.nombre : item.codigo_centro, // Mostrar el nombre si existe
               };
          }),
     };
     //console.log(transformedAsiento)

     return (
          <Stack spacing={3}>
               <div>
                    <Link
                         color="text.primary"
                         component={RouterLink}
                         //href={`/dashboard/asientos/${asientoId}`}
                         href={`/empresa/${selectedEmpresa.id}/dashboard/asientos`}
                         sx={{ alignItems: 'center', display: 'inline-flex', gap: 1,  mt: 2, ml: 2}}
                         variant="subtitle2"
                    >
                         <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                         Asientos
                    </Link>
               </div>

               <PDFViewer style={{ border: 'none', height: '100vh', width: '85vw' }}>
                    <AsientoPDFDocument asiento={transformedAsiento} />
               </PDFViewer>
          </Stack>
     );
}