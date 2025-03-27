import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { Controller, useForm } from 'react-hook-form';
import { UsuarioRequestType } from '@/api/user-types';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateUsuarioByEmpresa } from '@/api/user-request';
import { setFeedback } from '@/state/slices/feedBackSlice';

export function AccountDetails(): React.JSX.Element {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { empresaId } = useParams<{ empresaId: string }>();
     const user = useSelector((state: RootState) => state.authSlice.user);

     const { mutateAsync: updateUsuarioByEmpresa } = useUpdateUsuarioByEmpresa();

     const {
          handleSubmit,
          reset,
          control,
          formState: { errors }
     } = useForm<UsuarioRequestType>({
          defaultValues: {
               name: "",
               lastname: "",
               password: ""
          }
     });
     ;

     // Efecto para actualizar los valores cuando `user` cambia
     useEffect(() => {
          reset({
               name: user?.name || "",
               lastname: user?.lastname || "",
               password: "" // La contraseña se mantiene vacía
          });
     }, [user, reset]);

     const onSubmit = async (data: UsuarioRequestType) => {
          if (!user) return;

          try {
               await updateUsuarioByEmpresa({ empresaId: Number(empresaId), userId: user.id, data });

               dispatch(
                    setFeedback({
                         message: "Usuario actualizado con éxito",
                         severity: "success",
                         isError: false,
                    })
               );

               console.log("Datos enviados:", data);
          } catch (error: any) {
               console.error("Error al actualizar usuario:", error);
               let mensajeError = error.mensaje || "Ocurrió un error desconocido."; // Usa un mensaje predeterminado si no hay mensaje
               dispatch(
                    setFeedback({
                         message: mensajeError,
                         severity: "error",
                         isError: true,
                    })
               );
          }
     };

     // Regresar a la página anterior
     const handleCancel = () => navigate(-1); 
     // const handleCancel = () => {
     //     navigate('../../');
     // };

     return (
          <Card>
               <CardHeader
                    avatar={
                         <Avatar>
                              <UserIcon fontSize="var(--Icon-fontSize)" />
                         </Avatar>
                    }
                    title="Datos básicos"
               />
               <CardContent>
                    <Stack spacing={3}>
                         <Stack spacing={2}>
                              {/* FORMULARIO */}
                              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                                   <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'El nombre es obligatorio' }}
                                        render={({ field }) => (
                                             <TextField
                                                  {...field}
                                                  label="Nombre"
                                                  fullWidth
                                                  size="small"
                                                  margin="normal"
                                                  error={!!errors.name}
                                                  helperText={errors.name?.message}
                                             />
                                        )}
                                   />

                                   <Controller
                                        name="lastname"
                                        control={control}
                                        rules={{ required: 'El apellido es obligatorio' }}
                                        render={({ field }) => (
                                             <TextField
                                                  {...field}
                                                  label="Apellido"
                                                  fullWidth
                                                  size="small"
                                                  margin="normal"
                                                  error={!!errors.lastname}
                                                  helperText={errors.lastname?.message}
                                             />
                                        )}
                                   />

                                   <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                             minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                                        }}
                                        render={({ field }) => (
                                             <TextField
                                                  {...field}
                                                  label="Nueva contraseña (opcional)"
                                                  type="password"
                                                  fullWidth
                                                  size="small"
                                                  margin="normal"
                                                  error={!!errors.password}
                                                  helperText={errors.password?.message}
                                                  autoComplete="new-password"
                                             />
                                        )}
                                   />

                                   {/* BOTONES DENTRO DEL FORM PARA QUE FUNCIONE EL SUBMIT */}
                                   <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                                        <Button color="secondary" onClick={handleCancel}>Cancelar</Button>
                                        <Button type="submit" variant="contained">Guardar Cambios</Button>
                                   </CardActions>
                              </Box>
                         </Stack>
                    </Stack>
               </CardContent>
          </Card>
     );
}