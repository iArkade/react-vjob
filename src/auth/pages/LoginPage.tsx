import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginUser } from "../../api/userRequest";
import { setAuthenticated } from "../../state/slices/authSlice";
import { Card, CardContent, CardHeader, FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

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

     //const [error, setError] = React.useState('');
     const navigate = useNavigate();
     const {mutateAsync: login} = useLoginUser();
     const dispatch = useDispatch();

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

          try {
               event.preventDefault();
               const data = new FormData(event.currentTarget);
               const email = data.get('email') as string;
               const password = data.get('password') as string;

               const response = await login({email, password});
               //console.log(response.data.tokens);

               localStorage.setItem("token", response.data.tokens);
               dispatch(setAuthenticated({isAuthenticated: true}));
               navigate('/dashboard');
               
          } catch (error) {
               //setError('Validaciones Incorrectas');
               console.log(error)
          }
     };

     return (
          <Stack spacing={4}>
               <Card>
                    <CardHeader
                         subheader={
                              <Typography color="text.secondary" variant="body2">
                                   No tiene una cuenta? <Link href="/auth/register" variant="subtitle2">Registrarse</Link>
                              </Typography>
                         }
                         title="Iniciar Sesión"
                    />
                    <CardContent>
                         <form onSubmit={handleSubmit}>
                              <Stack spacing={2}>
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
