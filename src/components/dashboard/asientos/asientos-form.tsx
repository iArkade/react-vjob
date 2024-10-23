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
import { MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';



interface LineItem {
     id: string;
     description: string;
     service: string;
     quantity: number;
     unitPrice: number;
}

function calculateSubtotal(lineItems: LineItem[]): number {
     const subtotal = lineItems.reduce((acc, lineItem) => acc + lineItem.quantity * lineItem.unitPrice, 0);
     return parseFloat(subtotal.toFixed(2));
}

function calculateTotalWithoutTaxes(subtotal: number, discount: number, shippingRate: number): number {
     return subtotal - discount + shippingRate;
}

function calculateTax(totalWithoutTax: number, taxRate: number): number {
     const tax = totalWithoutTax * (taxRate / 100);
     return parseFloat(tax.toFixed(2));
}

function calculateTotal(totalWithoutTax: number, taxes: number): number {
     return totalWithoutTax + taxes;
}

const schema = zod
     .object({
          numero: zod.string().max(255),
          transaccion: zod.string().max(255),
          fecha_tr: zod.date(),
          comentario: zod.string().max(255),
          secuencial: zod.string().max(255),
          nro_reposicion: zod.string().max(255),
          nro_ref: zod.string().max(255),
          centro: zod.string().max(255),
          pago: zod.string().max(255),
          estado: zod.string().max(255),
          discount: zod
               .number()
               .min(0, 'Discount must be greater than or equal to 0')
               .max(100, 'Discount must be less than or equal to 100'),
          shippingRate: zod.number().min(0, 'Shipping rate must be greater than or equal to 0'),
          taxRate: zod
               .number()
               .min(0, 'Tax rate must be greater than or equal to 0')
               .max(100, 'Tax rate must be less than or equal to 100'),
          lineItems: zod.array(
               zod.object({
                    id: zod.string(),
                    description: zod.string(),
                    quantity: zod.number().min(1),
                    unitPrice: zod.number().min(0),
               })
          ),
          total1: zod.number(),
          total2: zod.number(),
          total3: zod.number(),
     })


type Values = zod.infer<typeof schema>;

const defaultValues = {
     numero: 'INV-001',
     transaccion: 'Asiento Diario',
     fecha_tr: new Date(),
     comentario: 'Esta es una prueba',
     secuencial: '000001',
     nro_reposicion: '0',
     nro_ref: '0',
     centro: '',
     pago: 'No Aplica',
     estado: 'Activado',
     discount: 0,
     shippingRate: 0,
     taxRate: 0,
     lineItems: [
          { id: '1', description: 'Item 1', quantity: 1, unitPrice: 100 },
          { id: '2', description: 'Item 2', quantity: 2, unitPrice: 50 },
     ],
     total1: 0,
     total2: 0,
     total3: 0,
} satisfies Values;

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

     const onSubmit = React.useCallback(
          async (data: Values): Promise<void> => {
               try {
                    console.log(data)
                    // Make API request
                    toast.success('Invoice created');
                    navigate(paths.dashboard.invoices.list);
               } catch (err) {
                    logger.error(err);
                    toast.error('Something went wrong!');
               }
          },
          [navigate]
     );

     // const handleAddLineItem = React.useCallback(() => {
     //      const lineItems = getValues('lineItems');

     //      setValue('lineItems', [
     //           ...lineItems,
     //           { id: `LI-${lineItems.length + 1}`, description: '', service: '', quantity: 1, unitPrice: 0 },
     //      ]);
     // }, [getValues, setValue]);

     // const handleRemoveLineItem = React.useCallback(
     //      (lineItemId: string) => {
     //           const lineItems = getValues('lineItems');

     //           setValue(
     //                'lineItems',
     //                lineItems.filter((lineItem) => lineItem.id !== lineItemId)
     //           );
     //      },
     //      [getValues, setValue]
     // );

     const lineItems = watch('lineItems');
     // const discount = watch('discount');
     // const shippingRate = watch('shippingRate');
     // const taxRate = watch('taxRate');

     // const subtotal = calculateSubtotal(lineItems);
     // const totalWithoutTaxes = calculateTotalWithoutTaxes(subtotal, discount, shippingRate);
     // const tax = calculateTax(totalWithoutTaxes, taxRate);
     // const total = calculateTotal(totalWithoutTaxes, tax);

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
                                                  name="numero"
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
                                                  name="transaccion"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <InputLabel>Transacción</InputLabel>
                                                            <Select {...field}>
                                                                 <MenuItem value="ADI">ADI - Asiento Diario</MenuItem>
                                                                 {/* Puedes agregar más opciones aquí */}
                                                            </Select>
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>


                                        <Grid size={{ xs: 12, md: 4 }}>
                                             <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                  <Controller
                                                       control={control}
                                                       name="fecha_tr"
                                                       render={({ field }) => (
                                                            <DatePicker
                                                                 {...field}
                                                                 format="MMM D, YYYY"
                                                                 label="Fecha Tr"
                                                                 onChange={(date) => field.onChange(date?.toDate())}
                                                                 slotProps={{
                                                                      textField: {
                                                                           error: Boolean(errors.fecha_tr),
                                                                           fullWidth: true,
                                                                           helperText: errors.fecha_tr?.message,
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
                                                  name="secuencial"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <InputLabel>Secuencial</InputLabel>
                                                            <OutlinedInput {...field} />
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                             <Controller
                                                  control={control}
                                                  name="nro_reposicion"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <InputLabel>Nro. Reposición</InputLabel>
                                                            <OutlinedInput {...field} />
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 4 }}>
                                             <Controller
                                                  control={control}
                                                  name="nro_ref"
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
                                                  name="centro"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <InputLabel>Centro</InputLabel>
                                                            <OutlinedInput {...field} />
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>
                                        <Grid size={{ xs: 2, md: 2 }}>
                                             <Button variant="outlined" sx={{ marginTop: '28px' }}>...</Button> {/* Botón adicional */}
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                             <Controller
                                                  control={control}
                                                  name="pago"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <InputLabel>Pago de</InputLabel>
                                                            <Select {...field}>
                                                                 <MenuItem value="NO_APLICA">No Aplica</MenuItem>
                                                                 {/* Agregar más opciones */}
                                                            </Select>
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>
                                   </Grid>
                              </Stack>

                              <Stack spacing={3}>
                                   <Typography variant="h6">Line items</Typography>
                                   <Stack divider={<Divider sx={{ borderBottomWidth: 2, borderColor: 'darkgray' }} />} spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                             <Table>
                                                  <TableHead>
                                                       <TableRow>
                                                            <TableCell>Centro</TableCell>
                                                            <TableCell>Cta.</TableCell>
                                                            <TableCell>Cta. Nombre</TableCell>
                                                            <TableCell>Debe</TableCell>
                                                            <TableCell>Haber</TableCell>
                                                            <TableCell>Nota</TableCell>
                                                            <TableCell>Imp(Nro)</TableCell>
                                                            <TableCell>Cod.Empleado</TableCell>

                                                       </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                       {lineItems.map((item, index) => (
                                                            <TableRow key={item.id}>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.description`} // Nombre dinámico
                                                                           render={({ field }) => (
                                                                                <OutlinedInput {...field} fullWidth />
                                                                           )}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.quantity`} // Nombre dinámico
                                                                           render={({ field }) => (
                                                                                <OutlinedInput
                                                                                     {...field}
                                                                                     type="number"
                                                                                     inputProps={{ min: 1 }}
                                                                                     fullWidth
                                                                                />
                                                                           )}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Controller
                                                                           control={control}
                                                                           name={`lineItems.${index}.unitPrice`} // Nombre dinámico
                                                                           render={({ field }) => (
                                                                                <OutlinedInput
                                                                                     {...field}
                                                                                     type="number"
                                                                                     inputProps={{ min: 0 }}
                                                                                     fullWidth
                                                                                />
                                                                           )}
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      {item.quantity * item.unitPrice}
                                                                 </TableCell>
                                                            </TableRow>
                                                       ))}
                                                  </TableBody>
                                             </Table>
                                        </Grid>
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
                                                  name="total1"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <OutlinedInput
                                                                 {...field}
                                                                 sx={{
                                                                      backgroundColor: '#FFFACD',  // Color amarillo claro
                                                                      fontWeight: 'bold',
                                                                      textAlign: 'right',
                                                                 }}
                                                                 defaultValue="0.00"
                                                            />
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 3 }}>
                                             <Controller
                                                  control={control}
                                                  name="total2"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <OutlinedInput
                                                                 {...field}
                                                                 sx={{
                                                                      backgroundColor: '#FFFACD',  // Color amarillo claro
                                                                      fontWeight: 'bold',
                                                                      textAlign: 'right',
                                                                 }}
                                                                 defaultValue="0.00"
                                                            />
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 3 }}>
                                             <Controller
                                                  control={control}
                                                  name="total3"
                                                  render={({ field }) => (
                                                       <FormControl fullWidth>
                                                            <OutlinedInput
                                                                 {...field}
                                                                 sx={{
                                                                      fontWeight: 'bold',
                                                                      textAlign: 'right',
                                                                 }}
                                                                 defaultValue="0.00"
                                                            />
                                                       </FormControl>
                                                  )}
                                             />
                                        </Grid>
                                   </Grid>

                              </Stack>

                              {/* <Grid container spacing={3}>
                                   <Grid size={{ xs: 12, md: 4 }} >
                                        <Controller
                                             control={control}
                                             name="discount"
                                             render={({ field }) => (
                                                  <FormControl error={Boolean(errors.discount)} fullWidth>
                                                       <InputLabel>Discount</InputLabel>
                                                       <OutlinedInput
                                                            {...field}
                                                            inputProps={{ step: 0.01 }}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                 const value = event.target.valueAsNumber;

                                                                 if (isNaN(value)) {
                                                                      field.onChange('');
                                                                      return;
                                                                 }

                                                                 field.onChange(parseFloat(value.toFixed(2)));
                                                            }}
                                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                            type="number"
                                                       />
                                                       {errors.discount ? <FormHelperText>{errors.discount.message}</FormHelperText> : null}
                                                  </FormControl>
                                             )}
                                        />
                                   </Grid>

                                   <Grid size={{ xs: 12, md: 4 }}>
                                        <Controller
                                             control={control}
                                             name="shippingRate"
                                             render={({ field }) => (
                                                  <FormControl error={Boolean(errors.shippingRate)} fullWidth>
                                                       <InputLabel>Shipping rate</InputLabel>
                                                       <OutlinedInput
                                                            {...field}
                                                            inputProps={{ step: 0.01 }}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                 const value = event.target.valueAsNumber;

                                                                 if (isNaN(value)) {
                                                                      field.onChange('');
                                                                      return;
                                                                 }

                                                                 field.onChange(parseFloat(value.toFixed(2)));
                                                            }}
                                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                            type="number"
                                                       />
                                                       {errors.shippingRate ? <FormHelperText>{errors.shippingRate.message}</FormHelperText> : null}
                                                  </FormControl>
                                             )}
                                        />
                                   </Grid>

                                   <Grid
                                        size={{ xs: 12, md: 4 }}
                                   >
                                        <Controller
                                             control={control}
                                             name="taxRate"
                                             render={({ field }) => (
                                                  <FormControl error={Boolean(errors.taxRate)} fullWidth>
                                                       <InputLabel>Tax rate (%)</InputLabel>
                                                       <OutlinedInput
                                                            {...field}
                                                            inputProps={{ step: 0.01 }}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                 const value = event.target.valueAsNumber;

                                                                 if (isNaN(value)) {
                                                                      field.onChange('');
                                                                      return;
                                                                 }

                                                                 if (value > 100) {
                                                                      field.onChange(100);
                                                                      return;
                                                                 }

                                                                 field.onChange(parseFloat(value.toFixed(2)));
                                                            }}
                                                            type="number"
                                                       />
                                                       {errors.taxRate ? <FormHelperText>{errors.taxRate.message}</FormHelperText> : null}
                                                  </FormControl>
                                             )}
                                        />
                                   </Grid>
                              </Grid> */}
                         </Stack>
                    </CardContent>
               </Card>
          </form>
     );
}
