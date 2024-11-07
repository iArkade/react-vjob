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
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CardActions, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';
import { useAccounts, useCreateAsiento } from '@/api/asientos/asientos-request';
import { DatCentro } from '@/api/asientos/asientos-types';
import { AccountSelectionModal } from './account-selection';


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
     estado: '',
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
     const {
          control,
          handleSubmit,
          formState: { errors },
          getValues,
          setValue,
          watch,
     } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

     const { data: centros = [], isLoading, isError } = useAccounts();
     const { mutate: createAsiento } = useCreateAsiento();

     const onSubmit = React.useCallback(
          async (data: Values): Promise<void> => {
               try {
                    // Make API request
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

                    createAsiento(dataToSend);
                    toast.success('Asiento creado exitosamente');
                    navigate(paths.dashboard.asientos.index);
               } catch (err) {
                    logger.error(err);
                    toast.error('Algo salió mal!');
               }
          },
          [navigate, createAsiento]
     );

     const handleCentroChange = React.useCallback(
          (selectedCentro: string) => {
               const lineItems = getValues('lineItems') || [];
               if (lineItems.length > 0) {
                    setValue(`lineItems.0.codigo_centro`, selectedCentro || '');
               } else {

                    handleAddLineItem();
                    setValue(`lineItems.0.codigo_centro`, selectedCentro || '');
               }
          }, [getValues, setValue]
     )

     const handleAddLineItem = React.useCallback(() => {
          const lineItems = getValues('lineItems') || [];
          const currentCentro = getValues('codigo_centro') || '';

          setValue('lineItems', [
               ...lineItems,
               {
                    id_asiento_item: `LI-${lineItems.length + 1}`,
                    codigo_centro: currentCentro, cta: '',
                    cta_nombre: '',
                    debe: 0,
                    haber: 0,
                    nota: ''
               },
          ]);
     }, [getValues, setValue]);

     const handleRemoveLineItem = React.useCallback(
          (lineItemId: string) => {
               const lineItems = getValues('lineItems') || [];

               setValue(
                    'lineItems',
                    lineItems.filter((lineItem) => lineItem.id_asiento_item !== lineItemId)
               );
          },
          [getValues, setValue]
     );

     const lineItems = watch('lineItems') || [];

     React.useEffect(() => {
          if (!lineItems) return;

          const totalDebe = lineItems.reduce((acc, item) => acc + parseFloat((item.debe || 0).toFixed(2)), 0);
          const totalHaber = lineItems.reduce((acc, item) => acc + parseFloat((item.haber || 0).toFixed(2)), 0);
          const totalCombined = parseFloat((totalDebe + totalHaber).toFixed(2));

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

                                        {/* <Grid size={{ xs: 12, md: 4 }}>
                                             <Controller
                                                  control={control}
                                                  name="tipo_transaccion"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <InputLabel>Transacción</InputLabel>
                                                            <Select {...field}>
                                                                 <MenuItem></MenuItem>
                                                            </Select>
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid> */}

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
                                   <Typography variant="h6">Line items</Typography>
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
                                                            <TableRow key={item.id_asiento_item}>
                                                                 <TableCell>
                                                                      <IconButton
                                                                           onClick={() => {
                                                                                handleRemoveLineItem(item.id_asiento_item);
                                                                           }}
                                                                           sx={{ alignSelf: 'flex-end' }}
                                                                      >
                                                                           <TrashIcon />
                                                                      </IconButton>
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.codigo_centro`}
                                                                           render={({ field }) => <OutlinedInput {...field} fullWidth />}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.cta`}
                                                                           render={({ field }) => (
                                                                                <OutlinedInput
                                                                                     {...field}
                                                                                     fullWidth
                                                                                     onClick={() => handleOpenModal(index)}
                                                                                />
                                                                           )}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.cta_nombre`}
                                                                           render={({ field }) => <OutlinedInput {...field} fullWidth />}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.debe`}
                                                                           render={({ field }) => (
                                                                                <OutlinedInput
                                                                                     {...field}
                                                                                     type="number" inputProps={{ min: 0, step: 0.01, pattern: "[0-9]*[.,]?[0-9]*" }}
                                                                                     onChange={(e) => {
                                                                                          const value = parseFloat(e.target.value) || 0;
                                                                                          field.onChange(value);
                                                                                          const updatedItems = [...getValues('lineItems')];
                                                                                          updatedItems[index].debe = value;
                                                                                          setValue('lineItems', updatedItems);
                                                                                     }}
                                                                                     fullWidth
                                                                                />
                                                                           )}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.haber`}
                                                                           render={({ field }) => (
                                                                                <OutlinedInput
                                                                                     {...field}
                                                                                     type="number"
                                                                                     inputProps={{ min: 0, step: 0.01, pattern: "[0-9]*[.,]?[0-9]*" }}
                                                                                     onChange={(e) => {
                                                                                          const value = parseFloat(e.target.value) || 0;
                                                                                          field.onChange(value);
                                                                                          const updatedItems = [...getValues('lineItems')];
                                                                                          updatedItems[index].haber = value;
                                                                                          setValue('lineItems', updatedItems);
                                                                                     }}
                                                                                     fullWidth
                                                                                />
                                                                           )}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.nota`}
                                                                           render={({ field }) => <OutlinedInput {...field} fullWidth />}
                                                                      />
                                                                 </TableCell>
                                                            </TableRow>
                                                       ))}
                                                  </TableBody>
                                             </Table>
                                        </TableContainer>
                                        <AccountSelectionModal
                                             open={openModal}
                                             onClose={handleCloseModal}
                                             onSelect={handleSelectAccount} // Maneja la selección de cuenta
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
                                             <Button
                                                  color="secondary"
                                                  onClick={handleAddLineItem}
                                                  startIcon={<PlusCircleIcon />}
                                                  variant="outlined"
                                             >
                                                  Add item
                                             </Button>
                                        </div>
                                   </Stack>
                              </Stack>

                              <Stack spacing={3}>
                                   <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ marginTop: '20px' }}>
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
                              Create invoice
                         </Button>
                    </CardActions>
               </Card>
          </form>
     );
}
