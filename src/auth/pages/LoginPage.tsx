import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Link from '@mui/material/Link';

// import { Link } from "react-router-dom";
import { z as zod } from 'zod';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginUser } from "../../api/userRequest";
// import { setAuthenticated } from "../../state/slices/authSlice";
import { Card, CardContent, CardHeader, FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

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

// const schema = zod.object({
//      email: zod.string().min(1, { message: 'Email is required' }).email(),
//      password: zod.string().min(1, { message: 'Password is required' }),
// });

// type Values = zod.infer<typeof schema>;

//const defaultTheme = createTheme();

export default function LoginPage() {

     const [error, setError] = React.useState('');

     const navigate = useNavigate();
     // const {mutateAsync: login} = useLoginUser();
     const loginUser = useLoginUser();

     const [showPassword, setShowPassword] = React.useState<boolean>();

     const [isPending, setIsPending] = React.useState<boolean>(false);

     // const {
     //      control,
     //      handleSubmit,
     //      setError,
     //      formState: { errors },
     // } = useForm<Values>({ resolver: zodResolver(schema) });


     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

          try {
               event.preventDefault();
               const data = new FormData(event.currentTarget);
               const email = data.get('email') as string;
               const password = data.get('password') as string;


               navigate('/');

          } catch (error) {
               setError('Validaciones Incorrectas')
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
                                             <InputLabel>Email address</InputLabel>
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

          // <ThemeProvider theme={defaultTheme}>
          //      <Container component="main" maxWidth="xs">
          //           <CssBaseline />
          //           <Box
          //                sx={{
          //                     marginTop: 8,
          //                     display: "flex",
          //                     flexDirection: "column",
          //                     alignItems: "center",
          //                }}
          //           >
          //                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          //                     <LockOutlinedIcon />
          //                </Avatar>
          //                <Typography component="h1" variant="h5">
          //                     Iniciar Sesión
          //                </Typography>
          //                <Box
          //                     component="form"
          //                     onSubmit={handleSubmit}
          //                     noValidate
          //                     sx={{ mt: 1 }}
          //                >
          //                     {error && <p style={{ color: 'red' }}>{error}</p>}
          //                     <TextField
          //                          margin="normal"
          //                          required
          //                          fullWidth
          //                          id="email"
          //                          label="Email"
          //                          name="email"
          //                          autoComplete="email"
          //                          autoFocus
          //                     />
          //                     <TextField
          //                          margin="normal"
          //                          required
          //                          fullWidth
          //                          name="password"
          //                          label="Contraseña"
          //                          type="password"
          //                          id="password"
          //                          autoComplete="current-password"
          //                     />

          //                     <Button
          //                          type="submit"
          //                          fullWidth
          //                          variant="contained"
          //                          sx={{ mt: 3, mb: 2 }}
          //                     >
          //                          Iniciar Sesión
          //                     </Button>
          //                     <Grid container>
          //                          <Grid item>
          //                               {/* <Link to="/auth/register">
          //                                    {"No tiene una cuenta? Registrate"}
          //                               </Link> */}
          //                          </Grid>
          //                     </Grid>
          //                </Box>
          //           </Box>
          //           <Copyright sx={{ mt: 8, mb: 4 }} />
          //      </Container>
          // </ThemeProvider>

     );
}
