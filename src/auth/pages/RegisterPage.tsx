import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUser } from '../../state/slices/authSlice';
import { useCreateUser } from '../../api/user-request';
import { Card, CardContent, CardHeader, FormControl, FormHelperText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { UsersType } from '@/api/user-types';



export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UsersType>({
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      password2: '',
      active: true,
    },
  });

  const onSubmit = async (data: UsersType) => {
    try {
      const { name, lastname, email, password } = data;

      // Proceed with user creation
      const response = await createUser.mutateAsync({ email, name, lastname, password, active: true });
      localStorage.setItem("token", response.data.tokens);
      dispatch(setUser({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        lastname: response.data.lastname,
      }));
      dispatch(setAuthenticated({ isAuthenticated: true }));
      navigate('/empresa');
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
