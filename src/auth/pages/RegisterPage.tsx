import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from '@mui/material/Link';
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../state/slices/authSlice';
import { useCreateUser } from '../../api/userRequest';
import { Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, InputLabel, OutlinedInput, Stack } from '@mui/material';

function Copyright(props: any) {
     return (
          <Typography variant="body2" color="text.secondary" align="center" {...props}>
               {'Copyright ©  VisualJob '}
               {new Date().getFullYear()}
               {'.'}
          </Typography>
     );
}

// const defaultTheme = createTheme();

export default function RegisterPage() {

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const createUser = useCreateUser();

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          try {
               event.preventDefault();
               const data = new FormData(event.currentTarget);
               const name = data.get('firstname') as string;
               const lastname = data.get('lastname') as string;
               const email = data.get('email') as string;
               const password = data.get('password') as string;
               const password2 = data.get('password2') as string;
               const validPassword = password && password2 && validatePassword(password, password2)
               const role = 'USER';
               const active = true;


               if(validPassword){
                    const response = await createUser.mutateAsync({email, name, lastname, password, role, active});
                    console.log('Create successful:', response.data);
                    dispatch(setUser({email, name, lastname, password}));
                    navigate('/');
               }
          } catch (error) {
               console.log(error);
          }
          
     };

     const validatePassword = (password: string, confirmationPassword : string): boolean =>{
          return password === confirmationPassword 
     }

     return (
          <Stack spacing={4}>
               <Card>
                    <CardHeader
                         subheader={
                              <Typography color="text.secondary" variant="body2">
                                   Ya tiene una cuenta? <Link href="/auth/login" variant="subtitle2">Iniciar Sesión</Link>
                              </Typography>
                         }
                         title="Registrarse"
                    />
                    <CardContent>
                         <Stack spacing={2}>
                              <FormControl>
                                   <InputLabel>Nombre</InputLabel>
                                   <OutlinedInput name="firstname" />
                              </FormControl>
                              <FormControl>
                                   <InputLabel>Apellido</InputLabel>
                                   <OutlinedInput name="lastname" />
                              </FormControl>
                              <FormControl>
                                   <InputLabel>Email</InputLabel>
                                   <OutlinedInput name="email" type="email" />
                              </FormControl>
                              <FormControl>
                                   <InputLabel>Contraseña</InputLabel>
                                   <OutlinedInput name="password" type="password" />
                              </FormControl>
                              <FormControl>
                                   <InputLabel>Confirmar Contraseña</InputLabel>
                                   <OutlinedInput name="password2" type="password" />
                              </FormControl>
                              {/* <div>
                                   <FormControlLabel
                                        control={<Checkbox name="terms" />}
                                        label={
                                             <React.Fragment>
                                                  I have read the <Link>terms and conditions</Link>
                                             </React.Fragment>
                                        }
                                   />
                              </div> */}
                              <Button type="submit" variant="contained">
                                   Registrarse
                              </Button>
                         </Stack>
                    </CardContent>
               </Card>
          </Stack>


          // <ThemeProvider theme={defaultTheme}>
          //      <Container component="main" maxWidth="xs">
          //           <CssBaseline />
          //           <Box
          //                sx={{
          //                     marginTop: 8,
          //                     display: 'flex',
          //                     flexDirection: 'column',
          //                     alignItems: 'center',
          //                }}
          //           >
          //                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          //                     <LockOutlinedIcon />
          //                </Avatar>
          //                <Typography component="h1" variant="h5">
          //                     Registrarse
          //                </Typography>
          //                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          //                     <Grid container spacing={2}>
          //                          <Grid item xs={12} sm={6}>
          //                               <TextField
          //                                    autoComplete="given-name"
          //                                    name="firstname"
          //                                    required
          //                                    fullWidth
          //                                    id="firstname"
          //                                    label="Nombre"
          //                                    autoFocus
          //                               />
          //                          </Grid>
          //                          <Grid item xs={12} sm={6}>
          //                               <TextField
          //                                    required
          //                                    fullWidth
          //                                    id="lastname"
          //                                    label="Apellido"
          //                                    name="lastname"
          //                                    autoComplete="family-name"
          //                               />
          //                          </Grid>
          //                          <Grid item xs={12}>
          //                               <TextField
          //                                    required
          //                                    fullWidth
          //                                    id="email"
          //                                    label="Email"
          //                                    name="email"
          //                                    autoComplete="email"
          //                               />
          //                          </Grid>
          //                          <Grid item xs={12}>
          //                               <TextField
          //                                    required
          //                                    fullWidth
          //                                    name="password"
          //                                    label="Contraseña"
          //                                    type="password"
          //                                    id="password"
          //                                    autoComplete="new-password"
          //                               />
          //                          </Grid>

          //                          <Grid item xs={12}>
          //                               <TextField
          //                                    required
          //                                    fullWidth
          //                                    name="password2"
          //                                    label="Confirmar Contraseña"
          //                                    type="password2"
          //                                    id="password2"
          //                               />
          //                          </Grid>

          //                     </Grid>
          //                     <Button
          //                          type="submit"
          //                          fullWidth
          //                          variant="contained"
          //                          sx={{ mt: 3, mb: 2 }}
          //                     >
          //                          Registrarse
          //                     </Button>
          //                     <Grid container justifyContent="flex-end">
          //                          <Grid item>
          //                               <Link to="/auth/login">
          //                                    Ya tienes una cuenta? Iniciar Sesión
          //                               </Link>
          //                          </Grid>
          //                     </Grid>
          //                </Box>
          //           </Box>
          //           <Copyright sx={{ mt: 5 }} />
          //      </Container>
          // </ThemeProvider>
     );
}