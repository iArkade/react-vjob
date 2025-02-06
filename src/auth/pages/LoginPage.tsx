import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLoginUser } from "../../api/user-request";
import { setUser } from "../../state/slices/authSlice";
import { Alert, Card, CardContent, CardHeader, FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

// function Copyright(props: any) {
//      return (
//           <Typography
//                variant="body2"
//                color="text.secondary"
//                align="center"
//                {...props}
//           >
//                {"Copyright © VisualJob  "}
//                {/* <Link color="inherit" href="https://mui.com/">
//                     Your Website
//                </Link>{" "} */}
//                {new Date().getFullYear()}
//                {"."}
//           </Typography>
//      );
// }

export default function LoginPage() {

     const [error, setError] = React.useState<string | null>(null);
     const navigate = useNavigate();
     const { mutateAsync: login } = useLoginUser();
     const dispatch = useDispatch();

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const email = data.get('email') as string;
          const password = data.get('password') as string;

          try {
               const response = await login({ email, password });
               //console.log(response.data);

               localStorage.setItem("token", response.data.tokens);
               
               dispatch(setUser({
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name,
                    lastname: response.data.lastname,
                    role: response.data.role
               }));
               
               navigate('/empresa');

          } catch (error: any) {
               //setError('Validaciones Incorrectas');
               if (error.response && error.response.data) {
                    console.log("Error:", error.response.data.message);
                    // Aquí puedes guardar el mensaje en el estado local para mostrarlo en la interfaz
                    setError(error.response.data.message);
               } else {
                    console.log("Error:", error.message);
                    setError("Se ha producido un error inesperado. Por favor, inténtelo de nuevo.");
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
                         <form onSubmit={handleSubmit}>
                              <Stack spacing={2}>

                                   {error && (
                                        <Alert severity="error">{error}</Alert>
                                   )}

                                   <Stack spacing={2}>
                                        <FormControl>
                                             <InputLabel>Correo</InputLabel>
                                             <OutlinedInput name="email" type="email" />
                                        </FormControl>
                                        <FormControl>
                                             <InputLabel>Password</InputLabel>
                                             <OutlinedInput name="password" type="password" />
                                        </FormControl>
                                        <Button type="submit" variant="contained">
                                             Iniciar Sesión
                                        </Button>
                                   </Stack>
                                   {/* <div>
                                        <Link variant="subtitle2">Forgot password?</Link>
                                   </div> */}
                              </Stack>
                         </form>
                    </CardContent>
               </Card>
          </Stack>
     );
}
