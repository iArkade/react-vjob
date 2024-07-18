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
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../state/slices/authSlice';

function Copyright(props: any) {
     return (
          <Typography variant="body2" color="text.secondary" align="center" {...props}>
               {'Copyright ©  VisualJob '}
               {new Date().getFullYear()}
               {'.'}
          </Typography>
     );
}

const defaultTheme = createTheme();

export default function RegisterPage() {

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = data.get('firstname') as string;
          const lastname = data.get('lastname') as string;
          const username = data.get('username') as string;
          const password = data.get('password') as string;
          const password2 = data.get('password2') as string;
          const validPassword = password && password2 && validatePassword(password, password2)

          if(validPassword){
               dispatch(setUser({name, lastname, username, password}));
               navigate('/');
          }
          
     };

     const validatePassword = (password: string, confirmationPassword : string): boolean =>{
          return password === confirmationPassword 
     }

     return (
          <ThemeProvider theme={defaultTheme}>
               <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                         sx={{
                              marginTop: 8,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                         }}
                    >
                         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                              <LockOutlinedIcon />
                         </Avatar>
                         <Typography component="h1" variant="h5">
                              Registrarse
                         </Typography>
                         <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                              <Grid container spacing={2}>
                                   <Grid item xs={12} sm={6}>
                                        <TextField
                                             autoComplete="given-name"
                                             name="firstname"
                                             required
                                             fullWidth
                                             id="firstname"
                                             label="Nombre"
                                             autoFocus
                                        />
                                   </Grid>
                                   <Grid item xs={12} sm={6}>
                                        <TextField
                                             required
                                             fullWidth
                                             id="lastname"
                                             label="Apellido"
                                             name="lastname"
                                             autoComplete="family-name"
                                        />
                                   </Grid>
                                   <Grid item xs={12}>
                                        <TextField
                                             required
                                             fullWidth
                                             id="username"
                                             label="Usuario"
                                             name="username"
                                             autoComplete="username"
                                        />
                                   </Grid>
                                   <Grid item xs={12}>
                                        <TextField
                                             required
                                             fullWidth
                                             name="password"
                                             label="Contraseña"
                                             type="password"
                                             id="password"
                                             autoComplete="new-password"
                                        />
                                   </Grid>

                                   <Grid item xs={12}>
                                        <TextField
                                             required
                                             fullWidth
                                             name="password2"
                                             label="Confirmar Contraseña"
                                             type="password2"
                                             id="password2"
                                        />
                                   </Grid>

                              </Grid>
                              <Button
                                   type="submit"
                                   fullWidth
                                   variant="contained"
                                   sx={{ mt: 3, mb: 2 }}
                              >
                                   Registrarse
                              </Button>
                              <Grid container justifyContent="flex-end">
                                   <Grid item>
                                        <Link to="/auth/login">
                                             Ya tienes una cuenta? Iniciar Sesión
                                        </Link>
                                   </Grid>
                              </Grid>
                         </Box>
                    </Box>
                    <Copyright sx={{ mt: 5 }} />
               </Container>
          </ThemeProvider>
     );
}