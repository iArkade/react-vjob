import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../state/slices/authSlice';
import { useRegisterUser } from '../../api/user-request';
import { Card, CardContent, CardHeader, FormControl, InputLabel, OutlinedInput, Stack } from '@mui/material';



export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerUser = useRegisterUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name") as string;
      const lastname = data.get("lastname") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const password2 = data.get("password2") as string;
      const validPassword =
        password && password2 && validatePassword(password, password2);
      const active = true;

      if (validPassword) {
        const response = await registerUser.mutateAsync({ email, name, lastname, password, active });
        console.log(response);
        
        localStorage.setItem("token", response.data.tokens);
        //console.log('Create successful:', response.data);
        dispatch(setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          lastname: response.data.lastname,
          role: response.data.role,
        }));
        navigate('/empresa');
      }
    } catch (error) {
      console.log(error);
    }
  };


  const validatePassword = (value: string | undefined) => {
    const password = watch('password');
    return value === password || 'Las contraseñas no coinciden.';
  };

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader
          subheader={
            <Typography color="text.secondary" variant="body2">
              Ya tiene una cuenta?{" "}
              <Link component={RouterLink} to="/auth/login" variant="subtitle2">
                Iniciar Sesión
              </Link>
            </Typography>
          }
          title="Registrarse"
        />
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
              {/* Name Field */}
              <FormControl error={!!errors.name}>
                <InputLabel>Nombre</InputLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'El nombre es requerido.' }}
                  render={({ field }) => (
                    <OutlinedInput {...field} />
                  )}
                />
                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
              </FormControl>

              {/* Lastname Field */}
              <FormControl error={!!errors.lastname}>
                <InputLabel>Apellido</InputLabel>
                <Controller
                  name="lastname"
                  control={control}
                  rules={{ required: 'El apellido es requerido.' }}
                  render={({ field }) => (
                    <OutlinedInput {...field} />
                  )}
                />
                {errors.lastname && <FormHelperText>{errors.lastname.message}</FormHelperText>}
              </FormControl>

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

              {/* Confirm Password Field */}
              <FormControl error={!!errors.password2}>
                <InputLabel>Confirmar Contraseña</InputLabel>
                <Controller
                  name="password2"
                  control={control}
                  rules={{
                    required: 'Confirme la contraseña.',
                    validate: validatePassword,
                  }}
                  render={({ field }) => (
                    <OutlinedInput {...field} type="password" />
                  )}
                />
                {errors.password2 && <FormHelperText>{errors.password2.message}</FormHelperText>}
              </FormControl>

              <Button type="submit" variant="contained">
                Registrarse
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
}
