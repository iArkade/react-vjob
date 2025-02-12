import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLoginUser } from "../../api/user-request";
import { setUser } from "../../state/slices/authSlice";
import { Alert, Card, CardContent, CardHeader, FormControl, FormHelperText, InputLabel, OutlinedInput, Snackbar, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { LoginRequestType } from "@/api/user-types";

export default function LoginPage() {
     const navigate = useNavigate();
     const { mutateAsync: login } = useLoginUser();
     const dispatch = useDispatch();

     const [errorMessage, setErrorMessage] = useState<string | null>(null);
     const [snackbarOpen, setSnackbarOpen] = useState(false);

     const {
          control,
          handleSubmit,
          setError,
          formState: { errors },
     } = useForm<LoginRequestType>({
          defaultValues: {
               email: '',
               password: '',
          },
     });

     const handleCloseSnackbar = () => {
          setSnackbarOpen(false);
          setErrorMessage(null);
     };

     const onSubmit = async (data: LoginRequestType) => {
          try {
               const { email, password } = data;

               const response = await login({ email, password });
               //console.log(response)
               localStorage.setItem("token", response.data.tokens);

               dispatch(setUser({
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name,
                    lastname: response.data.lastname,
                    role: response.data.systemRole
               }));

               navigate('/empresa');

          } catch (error: any) {
               if (error.response && error.response.data) {
                    // Set a form-wide error using React Hook Form's setError
                    setError('root', {
                         type: 'manual',
                         message: error.response.data.message,
                    });
               } else {
                    setError('root', {
                         type: 'manual',
                         message: "Se ha producido un error inesperado. Por favor, inténtelo de nuevo.",
                    });
               }
          }
     };

     return (
          <Stack spacing={4}>
               <Card>
                    <CardHeader
                         subheader={
                              <Typography color="text.secondary" variant="body2">
                                   No tiene una cuenta? <Link component={RouterLink} to="/auth/register" variant="subtitle2">Registrarse</Link>
                              </Typography>
                         }
                         title="Iniciar Sesión"
                    />
                    <CardContent>
                         <Snackbar
                              open={snackbarOpen}
                              onClose={handleCloseSnackbar}
                              autoHideDuration={6000}
                              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                         >
                              <Alert severity="error" onClose={handleCloseSnackbar}>
                                   {errorMessage}
                              </Alert>
                         </Snackbar>
                         <form onSubmit={handleSubmit(onSubmit)}>
                              <Stack spacing={2}>
                                   {/* Display form-wide error message if any */}
                                   {errors.root && (
                                        <Alert severity="error">{errors.root.message}</Alert>
                                   )}

                                   {/* Email Field */}
                                   <FormControl error={!!errors.email}>
                                        <InputLabel>Correo</InputLabel>
                                        <Controller
                                             name="email"
                                             control={control}
                                             rules={{
                                                  required: 'El correo es requerido.',
                                                  pattern: {
                                                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                       message: 'Correo electrónico no válido.',
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <OutlinedInput {...field} type="email" />
                                             )}
                                        />
                                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                                   </FormControl>

                                   {/* Password Field */}
                                   <FormControl error={!!errors.password}>
                                        <InputLabel>Contraseña</InputLabel>
                                        <Controller
                                             name="password"
                                             control={control}
                                             rules={{ required: 'La contraseña es requerida.' }}
                                             render={({ field }) => (
                                                  <OutlinedInput {...field} type="password" />
                                             )}
                                        />
                                        {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                                   </FormControl>

                                   <Button type="submit" variant="contained">
                                        Iniciar Sesión
                                   </Button>
                              </Stack>
                         </form>
                    </CardContent>
               </Card>
          </Stack>
     );
}
