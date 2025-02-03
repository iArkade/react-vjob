'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';

import { Building } from '@phosphor-icons/react';
import { EmpresaResponseType } from '@/api/empresas/empresa-types';
import { Controller, useForm } from 'react-hook-form';
import { useUpdateEmpresa } from '@/api/empresas/empresa-request';

export function CompanyDetails(): React.JSX.Element {

     const storedEmpresa = localStorage.getItem('empresa');
     //console.log(storedEmpresa)

     const defaultValues: EmpresaResponseType = storedEmpresa
          ? JSON.parse(storedEmpresa)
          : {
               codigo: '',
               ruc: '',
               nombre: '',
               correo: '',
               telefono: '',
               direccion: '',
               logo: '',
          };
     const {
          handleSubmit,
          control,
          formState: { errors },
          trigger,
          watch
     } = useForm<EmpresaResponseType>({
          defaultValues,
     });

     const [avatarSrc, setAvatarSrc] = React.useState(defaultValues.logo);

     // const { mutate: updateEmpresa, isLoading } = useUpdateEmpresa();

     const onSubmit = (data: EmpresaResponseType) => {
          //console.log('Formulario enviado:', data);
          const id = 1; 
          const updatedData = { ...data, logo: avatarSrc };
          // updateEmpresa(
          //      { id, data: updatedData },
          //      {
          //           onSuccess: () => {
          //                console.log('Empresa updated successfully');
          //                localStorage.setItem('empresa', JSON.stringify(updatedData));
          //           },
          //           onError: (error) => {
          //                console.error('Error updating empresa:', error);
          //           },
          //      }
          // );
     };

     return (
          <Card>
               <CardHeader
                    avatar={
                         <Avatar>
                              <Building size={32} />
                         </Avatar>
                    }
                    title="Datos básicos"
               />
               <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                         <Stack spacing={3}>
                              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                   <Box
                                        sx={{
                                             border: '1px dashed var(--mui-palette-divider)',
                                             borderRadius: '50%',
                                             display: 'inline-flex',
                                             p: '4px',
                                        }}
                                   >
                                        <Box sx={{ borderRadius: 'inherit', position: 'relative' }}>
                                             <Box
                                                  sx={{
                                                       alignItems: 'center',
                                                       bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                       borderRadius: 'inherit',
                                                       bottom: 0,
                                                       color: 'var(--mui-palette-common-white)',
                                                       cursor: 'pointer',
                                                       display: 'flex',
                                                       justifyContent: 'center',
                                                       left: 0,
                                                       opacity: 0,
                                                       position: 'absolute',
                                                       right: 0,
                                                       top: 0,
                                                       zIndex: 1,
                                                       '&:hover': { opacity: 1 },
                                                  }}
                                             >
                                                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                       <CameraIcon fontSize="var(--icon-fontSize-md)" />
                                                       <Typography color="inherit" variant="subtitle2">
                                                            Select
                                                       </Typography>
                                                       <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{
                                                                 position: 'absolute',
                                                                 width: '100%',
                                                                 height: '100%',
                                                                 top: 0,
                                                                 left: 0,
                                                                 opacity: 0,
                                                                 cursor: 'pointer',
                                                            }}
                                                            onChange={(e) => {
                                                                 if (e.target.files && e.target.files[0]) {
                                                                      const reader = new FileReader();
                                                                      reader.onload = (event) => {
                                                                           setAvatarSrc(event.target?.result as string); // Update avatar source
                                                                      };
                                                                      reader.readAsDataURL(e.target.files[0]);
                                                                 }
                                                            }}
                                                       />
                                                  </Stack>
                                             </Box>
                                             <Avatar src={avatarSrc} sx={{ '--Avatar-size': '100px' }} />
                                        </Box>
                                   </Box>
                                   <Button color="secondary" size="small">
                                        Remove
                                   </Button>
                              </Stack>
                              <Stack spacing={2}>
                                   <FormControl error={!!errors.codigo}>
                                        <InputLabel>Codigo</InputLabel>
                                        <Controller
                                             name="codigo"
                                             control={control}
                                             rules={{
                                                  required: 'El Código es obligatorio', // Add required validation rule
                                             }}
                                             render={({ field }) => <OutlinedInput {...field} />}
                                        />
                                        <FormHelperText>{errors.codigo?.message}</FormHelperText>
                                   </FormControl>

                                   <FormControl error={!!errors.ruc}>
                                        <InputLabel>Ruc</InputLabel>
                                        <Controller
                                             name="ruc"
                                             control={control}
                                             rules={{
                                                  required: 'El teléfono es obligatorio', // Required validation
                                                  validate: {
                                                       isNotEmpty: (value) =>
                                                            value.trim() !== '' || 'El teléfono solo puede contener números!',
                                                       isExactLength: (value) =>
                                                            value.length === 10 || 'El teléfono solo puede tener 10 dígitos',
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <OutlinedInput
                                                       {...field}
                                                       placeholder="e.g 1723456789001"
                                                       value={field.value || ''} // Ensure it doesn't show "undefined"
                                                       onChange={(e) => {
                                                            const value = e.target.value
                                                                 .replace(/[^0-9]/g, '') // Allow only numbers
                                                                 .slice(0, 13); // Limit to 13 characters
                                                            field.onChange(value);
                                                            trigger('ruc');
                                                       }}
                                                  />
                                             )}
                                        />
                                        <FormHelperText>{errors.ruc?.message}</FormHelperText>
                                   </FormControl>

                                   <FormControl error={!!errors.nombre}>
                                        <InputLabel>Nombre</InputLabel>
                                        <Controller
                                             name="nombre"
                                             control={control}
                                             rules={{
                                                  required: 'El Nombre es obligatorio'
                                             }}
                                             render={({ field }) => <OutlinedInput {...field} placeholder="e.g Company Name" />}
                                        />
                                        <FormHelperText>{errors.nombre?.message}</FormHelperText>
                                   </FormControl>
                                   <FormControl error={!!errors.correo}>
                                        <InputLabel>Correo</InputLabel>
                                        <Controller
                                             name="correo"
                                             control={control}
                                             rules={{
                                                  required: 'El correo es obligatorio', // Required validation
                                                  pattern: {
                                                       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                       message: 'Ingrese un correo válido', // Error message if email is invalid
                                                  },
                                             }}
                                             render={({ field }) => <OutlinedInput {...field} placeholder="e.g email@example.com" />}
                                        />
                                        <FormHelperText>{errors.correo?.message}</FormHelperText>
                                   </FormControl>

                                   <Stack direction="row" spacing={2}>
                                        <FormControl sx={{ flex: '1 1 auto' }} error={!!errors.telefono}>
                                             <InputLabel>Telefono</InputLabel>
                                             <Controller
                                                  name="telefono"
                                                  control={control}
                                                  rules={{
                                                       required: 'El teléfono es obligatorio',
                                                       validate: {
                                                            isNotEmpty: (value) =>
                                                                 value.trim() !== '' || 'El teléfono solo puede contener números!',
                                                            isExactLength: (value) =>
                                                                 value.length === 10 || 'El teléfono solo puede tener 10 dígitos',
                                                       },
                                                  }}
                                                  render={({ field }) => (
                                                       <OutlinedInput
                                                            {...field}
                                                            placeholder="e.g 0989890946"
                                                            value={field.value || ''} // Ensure it doesn't show "undefined"
                                                            onChange={(e) => {
                                                                 const value = e.target.value
                                                                      .replace(/[^0-9]/g, '') // Allow only numbers
                                                                      .slice(0, 10); // Limit to 13 characters
                                                                 field.onChange(value);
                                                                 trigger('telefono');
                                                            }}
                                                       />
                                                  )}
                                             />
                                             <FormHelperText>{errors.telefono?.message}</FormHelperText>
                                        </FormControl>
                                   </Stack>
                                   <FormControl error={!!errors.direccion}>
                                        <InputLabel>Direccion</InputLabel>
                                        <Controller
                                             name="direccion"
                                             control={control}
                                             rules={{
                                                  required: 'La dirección es obligatoria',
                                                  maxLength: {
                                                       value: 400,
                                                       message: 'La dirección no puede tener más de 400 caracteres',
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <OutlinedInput
                                                       {...field}
                                                       placeholder="Ingrese la direccion de su empresa..."
                                                       multiline
                                                       rows={4}
                                                  />
                                             )}
                                        />
                                        <FormHelperText>
                                             {`${watch('direccion', '').length}/400 characters`} {/* Dynamically track the value */}                                        </FormHelperText>
                                        <FormHelperText>{errors.direccion?.message}</FormHelperText> {/* Shows error if validation fails */}
                                   </FormControl>
                              </Stack>
                         </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                         <Button color="secondary">Cancelar</Button>
                         <Button type="submit" variant="contained">Guardar</Button>
                    </CardActions>
               </form>
          </Card>
     );
}
