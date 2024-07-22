import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from "../../state/store";
import { setAuthenticated } from '../../state/slices/authSlice';
import { useLoginUser } from "../../api/userRequest";

function Copyright(props: any) {
     return (
          <Typography
               variant="body2"
               color="text.secondary"
               align="center"
               {...props}
          >
               {"Copyright © VisualJob  "}
               {/* <Link color="inherit" href="https://mui.com/">
                    Your Website
               </Link>{" "} */}
               {new Date().getFullYear()}
               {"."}
          </Typography>
     );
}

const defaultTheme = createTheme();

export default function LoginPage() {
     
     const [error, setError] = React.useState('');
     const dispatch = useDispatch();
     const navigate = useNavigate();
     // const {mutateAsync: login} = useLoginUser();
     const loginUser = useLoginUser();

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

          try {
               event.preventDefault();
               const data = new FormData(event.currentTarget);
               const email = data.get('email') as string;
               const password = data.get('password') as string;

               const response = await loginUser.mutateAsync({email, password});
               console.log('Login successful:', response.data);

               localStorage.setItem('user', JSON.stringify(response.data));
               const isAuthenticated = true;

               dispatch(setAuthenticated({isAuthenticated}));
               navigate('/');


          } catch (error) {
               setError('Validaciones Incorrectas')
          }
          

     };

     return (
          <ThemeProvider theme={defaultTheme}>
               <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                         sx={{
                              marginTop: 8,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                         }}
                    >
                         <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                              <LockOutlinedIcon />
                         </Avatar>
                         <Typography component="h1" variant="h5">
                              Iniciar Sesión
                         </Typography>
                         <Box
                              component="form"
                              onSubmit={handleSubmit}
                              noValidate
                              sx={{ mt: 1 }}
                         >
                              {error && <p style={{ color: 'red' }}>{error}</p>}
                              <TextField
                                   margin="normal"
                                   required
                                   fullWidth
                                   id="email"
                                   label="Email"
                                   name="email"
                                   autoComplete="email"
                                   autoFocus
                              />
                              <TextField
                                   margin="normal"
                                   required
                                   fullWidth
                                   name="password"
                                   label="Contraseña"
                                   type="password"
                                   id="password"
                                   autoComplete="current-password"
                              />
               
                              <Button
                                   type="submit"
                                   fullWidth
                                   variant="contained"
                                   sx={{ mt: 3, mb: 2 }}
                              >
                                   Iniciar Sesión
                              </Button>
                              <Grid container>
                                   <Grid item>
                                        <Link to="/auth/register">
                                             {"No tiene una cuenta? Registrate"}
                                        </Link>
                                   </Grid>
                              </Grid>
                         </Box>
                    </Box>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
               </Container>
          </ThemeProvider>
     );
}
