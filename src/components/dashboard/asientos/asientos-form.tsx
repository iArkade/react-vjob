'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlusCircle as PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CardActions, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Box, Snackbar, Alert } from '@mui/material';
import { useAccounts, useCreateAsiento } from '@/api/asientos/asientos-request';
import { DatCentro } from '@/api/asientos/asientos-types';
import { AccountSelectionModal } from './account-selection';
import LineItemRow from './asientos-line-item-row';
import { useGetTransaccionContable } from '@/api/transaccion_contable/transaccion-contableRequest';


const schema = zod
     .object({
          nro_asiento: zod.string().max(255),
          tipo_transaccion: zod.string().max(255),
          fecha_emision: zod.date(),
          comentario: zod.string().max(1500),
          secuencial: zod.string().max(255),
          nro_referencia: zod.string().max(255),
          codigo_centro: zod.string().max(255),
          estado: zod.string().max(255),
          lineItems: zod.array(
               zod.object({
                    id_asiento_item: zod.string(),
                    codigo_centro: zod.string(),
                    cta: zod.string(),
                    cta_nombre: zod.string(),
                    debe: zod.number().default(0),
                    haber: zod.number().default(0),
                    nota: zod.string(),
               })
          ),
          total_debe: zod
               .number()
               .min(0, 'El total de debe tiene que ser mayor o igual que 0')
               .transform((val) => parseFloat(val.toFixed(2))),
          total_haber: zod
               .number()
               .min(0, 'El total de haber tiene que ser mayor o igual que 0')
               .transform((val) => parseFloat(val.toFixed(2))),
          total: zod.number(),
     })

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
     nro_asiento: '',
     tipo_transaccion: '',
     fecha_emision: new Date(),
     comentario: '',
     secuencial: '',
     nro_referencia: '',
     codigo_centro: '',
     estado: 'Activo',
     lineItems: [{
          id_asiento_item: 'LI-1',
          codigo_centro: '',
          cta: '',
          cta_nombre: '',
          debe: 0,
          haber: 0,
          nota: ''
     }],
     total_debe: 0,
     total_haber: 0,
     total: 0,
};

export function AsientosForm(): React.JSX.Element {
     const navigate = useNavigate();

     const methods = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });
     const {
          control,
          handleSubmit,
          formState: { errors },
          getValues,
          setValue,
          watch,
     } = methods;

     const { data: centros = [], isLoading, isError } = useAccounts();
     const { data: transacciones = [], isLoading, isError } = useGetTransaccionContable()
     const { mutate: createAsiento } = useCreateAsiento();

     const [snackbar, setSnackbar] = React.useState({
          open: false,
          message: '',
          severity: 'success' as 'success' | 'error',
     });

     const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));

     const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
          setSnackbar({ open: true, message, severity });
     };

     const validateTotals = (totalDebe: number, totalHaber: number) => {
          const totalCombined = Math.abs(totalDebe - totalHaber);

          if (totalCombined !== 0) {
               showSnackbar('El saldo debe estar balanceado. La diferencia entre Debe y Haber debe ser cero.', 'error');
               console.log("Error: La diferencia entre Debe y Haber no es cero.");
               return false;
          }

          if (totalDebe === 0 && totalHaber === 0) {
               showSnackbar('No se puede enviar un asiento sin valores en Debe o Haber.', 'error');
               console.log("Error: Tanto Debe como Haber están en cero.");
               return false;
          }
          return true;
     };

     const onSubmit = React.useCallback(
          async (data: Values): Promise<void> => {
               try {

                    const totalDebe = parseFloat((getValues('total_debe') || 0).toFixed(2));
                    const totalHaber = parseFloat((getValues('total_haber') || 0).toFixed(2));

                    if (!validateTotals(totalDebe, totalHaber)) return;

                    const { total, total_debe, total_haber, lineItems, ...asientoData } = data;

                    const dataToSend = {
                         ...asientoData,
                         fecha_emision: new Date(data.fecha_emision).toISOString().slice(0, 10),
                         total_debe: parseFloat(total_debe.toFixed(2)),
                         total_haber: parseFloat(total_haber.toFixed(2)),
                         lineItems: lineItems.map(({ id_asiento_item, ...rest }) => ({
                              ...rest,
                              debe: parseFloat(rest.debe.toFixed(2)),
                              haber: parseFloat(rest.haber.toFixed(2)),
                         })),
                    };

                    await createAsiento(dataToSend);
                    showSnackbar('Asiento creado exitosamente', 'success');
                    //navigate(paths.dashboard.asientos.index);
                    //window.location.reload();
               } catch (err) {
                    logger.error(err);
                    showSnackbar('Algo salió mal!', 'error');
               }
          },
          [navigate, createAsiento, getValues]
     );

     const handleCentroChange = React.useCallback(
          (selectedCentro: string) => {
               const lineItems = getValues('lineItems') || [];
               if (lineItems.length === 0) {
                    setValue('lineItems', [
                         {
                              id_asiento_item: `LI-1`,
                              codigo_centro: selectedCentro,
                              cta: '',
                              cta_nombre: '',
                              debe: 0,
                              haber: 0,
                              nota: ''
                         }
                    ]);
               } else {
                    setValue(`lineItems.0.codigo_centro`, selectedCentro);
               }
          }, [getValues, setValue]
     )

     const handleAddLineItem = React.useCallback(() => {
          const lineItems = getValues('lineItems') || [];
          const currentCentro = getValues('codigo_centro') || '';
     
          // Crea una copia de lineItems y agrega el nuevo elemento
          const newLineItems = [
               ...lineItems,
               {
                    id_asiento_item: `LI-${lineItems.length + 1}`,
                    codigo_centro: currentCentro,
                    cta: '',
                    cta_nombre: '',
                    debe: 0,
                    haber: 0,
                    nota: ''
               },
          ];
          setValue('lineItems', newLineItems);
     }, [getValues, setValue]);
     
     const handleRemoveLineItem = React.useCallback((lineItemId: string) => {
          const lineItems = getValues('lineItems') || [];
     
          // Filtra los elementos y crea una nueva lista sin el item especificado
          const newLineItems = lineItems.filter((lineItem) => lineItem.id_asiento_item !== lineItemId);
          setValue('lineItems', newLineItems);
     }, [getValues, setValue]);

     const lineItems = watch('lineItems') || [];

     React.useEffect(() => {
          if (!lineItems) return;
          const totalDebe = lineItems.reduce((acc, item) => acc + parseFloat((item.debe || 0).toFixed(2)), 0);
          const totalHaber = lineItems.reduce((acc, item) => acc + parseFloat((item.haber || 0).toFixed(2)), 0);
          const totalCombined = parseFloat((totalDebe - totalHaber).toFixed(2));

          setValue('total_debe', totalDebe);
          setValue('total_haber', totalHaber);
          setValue('total', totalCombined);
     }, [lineItems, setValue]);

     const [openModal, setOpenModal] = React.useState(false);
     const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

     const handleOpenModal = (index: number) => {
          setSelectedIndex(index);
          setOpenModal(true);
     };

     const handleCloseModal = () => {
          setOpenModal(false);
     };

     const handleSelectAccount = (code: string, name: string) => {
          if (selectedIndex !== null) {
               setValue(`lineItems.${selectedIndex}.cta`, code);
               setValue(`lineItems.${selectedIndex}.cta_nombre`, name);
          }
          handleCloseModal();
     };

     return (
          <FormProvider {...methods}>
               <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                         <CardContent>
                              <Stack divider={<Divider sx={{ borderBottomWidth: 2, borderColor: 'darkgray' }} />} spacing={4}>
                                   <Stack spacing={3}>
                                        <Grid container spacing={3}>
                                             <Grid size={{ xs: 12, md: 4 }}>
                                                  <Controller
                                                       control={control}
                                                       name="nro_asiento"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <InputLabel>Numero:</InputLabel>
                                                                 <OutlinedInput {...field} />
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 4 }}>
                                                  <Controller
                                                       control={control}
                                                       name="estado"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <InputLabel>Estado:</InputLabel>
                                                                 <OutlinedInput {...field} />
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 4 }}>
                                                  <Controller
                                                       control={control}
                                                       name="tipo_transaccion"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <InputLabel>Transacción</InputLabel>
                                                                 <Select 
                                                                      {...field}
                                                                      label="Transaccion"
                                                                      disabled={isLoading || isError}
                                                                      value={field.value || ''}

                                                                 >
                                                                      {isError && <Option value=""><em>Error cargando centros</em></Option>}
                                                                      
                                                                      {isLoading ? (
                                                                           <Option value=""><em>Cargando transaccion...</em></Option>
                                                                      ) : (
                                                                           transacciones?.map((transaccion: DatCentro) => (
                                                                                <Option key={centro.id} value={centro.nombre}>
                                                                                     {centro.nombre}
                                                                                </Option>
                                                                           ))
                                                                      )}
                                                                 </Select>
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 4 }}>
                                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                       <Controller
                                                            control={control}
                                                            name="fecha_emision"
                                                            render={({ field }) => (
                                                                 <DatePicker
                                                                      {...field}
                                                                      format="D MMM YYYY"
                                                                      label="Fecha Tr"
                                                                      onChange={(date) => field.onChange(date?.toDate())}
                                                                      slotProps={{
                                                                           textField: {
                                                                                error: Boolean(errors.fecha_emision),
                                                                                fullWidth: true,
                                                                                helperText: errors.fecha_emision?.message,
                                                                           },
                                                                      }}
                                                                      value={dayjs(field.value)}
                                                                 />
                                                            )}
                                                       />
                                                  </LocalizationProvider>
                                             </Grid>

                                             <Grid size={{ xs: 12 }}>
                                                  <Controller
                                                       control={control}
                                                       name="comentario"
                                                       render={({ field }) => (
                                                            <FormControl error={Boolean(errors.comentario)} fullWidth>
                                                                 <InputLabel>Comentario</InputLabel>
                                                                 <OutlinedInput {...field} placeholder="e.g Esto es una Prueba" />
                                                                 {errors.comentario && <FormHelperText>{errors.comentario.message}</FormHelperText>}
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 4 }}>
                                                  <Controller
                                                       control={control}
                                                       name="nro_referencia"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <InputLabel>Nro. Ref</InputLabel>
                                                                 <OutlinedInput {...field} />
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 10, md: 6 }}>
                                                  <Controller
                                                       control={control}
                                                       name="codigo_centro"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <InputLabel>Centro</InputLabel>
                                                                 <Select
                                                                      {...field}
                                                                      label="Centro"
                                                                      disabled={isLoading || isError}
                                                                      value={field.value || ''}
                                                                      onChange={(e) => {
                                                                           field.onChange(e);
                                                                           handleCentroChange(e.target.value);
                                                                      }}
                                                                 >
                                                                      {isError && <Option value=""><em>Error cargando centros</em></Option>}

                                                                      {isLoading ? (
                                                                           <Option value=""><em>Cargando centros...</em></Option>
                                                                      ) : (
                                                                           centros?.map((centro: DatCentro) => (
                                                                                <Option key={centro.id} value={centro.nombre}>
                                                                                     {centro.nombre}
                                                                                </Option>
                                                                           ))
                                                                      )}
                                                                 </Select>
                                                                 {errors.codigo_centro && <FormHelperText error>{errors.codigo_centro.message}</FormHelperText>}
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 2, md: 2 }}>
                                                  <Button variant="outlined" sx={{ marginTop: '28px' }}>...</Button> {/* Botón adicional */}
                                             </Grid>
                                        </Grid>
                                   </Stack>

                                   <Stack spacing={3}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                             <Typography variant="h6">Line items</Typography>
                                             <Button
                                                  color="secondary"
                                                  onClick={handleAddLineItem}
                                                  startIcon={<PlusCircleIcon />}
                                                  variant="outlined"
                                             >
                                                  Agregar Item
                                             </Button>
                                        </Box>
                                        <Stack divider={<Divider sx={{ borderBottomWidth: 2, borderColor: 'darkgray' }} />} spacing={2}>
                                             <TableContainer component={Paper}>
                                                  <Table>
                                                       <TableHead>
                                                            <TableRow>
                                                                 <TableCell></TableCell>
                                                                 <TableCell>Centro</TableCell>
                                                                 <TableCell>Cta.</TableCell>
                                                                 <TableCell>Cta. Nombre</TableCell>
                                                                 <TableCell>Debe</TableCell>
                                                                 <TableCell>Haber</TableCell>
                                                                 <TableCell>Nota</TableCell>
                                                            </TableRow>
                                                       </TableHead>
                                                       <TableBody>
                                                            {lineItems.map((item, index) => (
                                                                 <LineItemRow
                                                                      key={item.id_asiento_item}
                                                                      item={item}
                                                                      index={index}
                                                                      onRemove={handleRemoveLineItem}
                                                                      handleOpenModal={handleOpenModal}
                                                                 />
                                                            ))}
                                                       </TableBody>
                                                  </Table>
                                             </TableContainer>
                                             <AccountSelectionModal
                                                  open={openModal}
                                                  onClose={handleCloseModal}
                                                  onSelect={handleSelectAccount}
                                             />
                                        </Stack>
                                   </Stack>

                                   <Snackbar
                                        open={snackbar.open}
                                        autoHideDuration={snackbar.severity === 'error' ? 6000 : 3000}
                                        onClose={handleSnackbarClose}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                   >
                                        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                                             {snackbar.message}
                                        </Alert>
                                   </Snackbar>

                                   <Stack spacing={3}>
                                        <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ marginTop: '10px' }}>
                                             <Grid size={{ xs: 12, md: 2 }}>
                                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Totales:</Typography>
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 3 }}>
                                                  <Controller
                                                       control={control}
                                                       name="total_debe"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <OutlinedInput
                                                                      {...field}
                                                                      sx={{
                                                                           backgroundColor: '#FFFACD',  // Color amarillo claro
                                                                           fontWeight: 'bold',
                                                                           textAlign: 'right',
                                                                      }}
                                                                      value={field.value || '0.00'}
                                                                      readOnly
                                                                 />
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 3 }}>
                                                  <Controller
                                                       control={control}
                                                       name="total_haber"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <OutlinedInput
                                                                      {...field}
                                                                      sx={{
                                                                           backgroundColor: '#FFFACD',  // Color amarillo claro
                                                                           fontWeight: 'bold',
                                                                           textAlign: 'right',
                                                                      }}
                                                                      value={field.value || '0.00'}
                                                                      readOnly
                                                                 />
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>

                                             <Grid size={{ xs: 12, md: 3 }}>
                                                  <Controller
                                                       control={control}
                                                       name="total"
                                                       render={({ field }) => (
                                                            <FormControl fullWidth>
                                                                 <OutlinedInput
                                                                      {...field}
                                                                      sx={{
                                                                           fontWeight: 'bold',
                                                                           textAlign: 'right',
                                                                      }}
                                                                      value={field.value || '0.00'}
                                                                 />
                                                            </FormControl>
                                                       )}
                                                  />
                                             </Grid>
                                        </Grid>
                                   </Stack>
                              </Stack>
                         </CardContent>
                         <CardActions sx={{ justifyContent: 'flex-end' }}>
                              <Button color="secondary">Cancel</Button>
                              <Button type="submit" variant="contained">
                                   Crear Asiento
                              </Button>
                         </CardActions>
                    </Card>
               </form>
          </FormProvider>
     );
}
