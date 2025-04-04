import React from 'react';
import {
     Dialog,
     DialogTitle,
     DialogContent,
     DialogActions,
     Button,
     TextField,
     MenuItem,
     Box
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { UsuarioRequestType, UsuarioResponseType } from '@/api/user-types';

interface UsuarioDialogProps {
     open: boolean;
     onClose: () => void;
     onSubmit: (data: UsuarioRequestType) => void;
     currentUser: UsuarioResponseType | null;
     empresaId: number;
     user: {
          id: number;
          systemRole: string;
          empresas: { role: string }[];
     };
}

const roles: string[] = ['admin', 'user', 'employer'];

export function UsuarioModal({ open, onClose, onSubmit, currentUser, empresaId, user }: UsuarioDialogProps) {
     const {
          handleSubmit,
          reset,
          control,
          formState: { errors }
     } = useForm<UsuarioRequestType>();

     //console.log(user)

     React.useEffect(() => {
          if (currentUser) {
               reset({
                    id: currentUser.id,
                    name: currentUser.name,
                    lastname: currentUser.lastname,
                    email: currentUser.email,
                    password: '',
                    empresas: [{
                         empresaId: currentUser.empresas[0]?.empresa.id || empresaId,
                         companyRole: currentUser.empresas[0]?.companyRole || 'user',
                    }],
               });
          } else {
               reset({
                    name: '',
                    lastname: '',
                    email: '',
                    password: '',
                    empresas: [{ empresaId, companyRole: 'user' }],
               });
          }
     }, [currentUser, reset, empresaId]);

     // Determina si el usuario actual puede editar el rol del usuario que se está editando
     const canEditRole = () => {
          // Si es un usuario nuevo, el superadmin puede establecer cualquier rol, pero un admin no puede asignar el rol de admin
          if (!currentUser) {
               if (user.systemRole === 'superadmin') {
                    return true;
               }
               if (user.empresas[0]?.role === 'admin') {
                    return true; // Admin puede asignar roles, pero controlamos qué roles en el select
               }
               return false;
          }

          // Si es el usuario actual, no puede cambiar su propio rol
          if (currentUser.id === user.id) {
               return false;
          }

          // Si el usuario actual es superadmin, puede editar cualquier rol
          if (user.systemRole === 'superadmin') {
               return true;
          }

          // Si el usuario actual es admin, solo puede editar roles de usuarios normales y NO asignar otro admin
          if (user.empresas[0]?.role === 'admin') {
               //console.log(user.empresas[0]?.role)
               return currentUser.empresas[0]?.companyRole !== 'admin' &&
                    currentUser.systemRole !== 'superadmin';
          }

          // Usuarios normales no pueden editar roles
          return false;
     };


     return (
          <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
               <DialogTitle>{currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
               <DialogContent>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                         <Controller
                              name="name"
                              control={control}
                              rules={{ required: 'El nombre es obligatorio' }}
                              render={({ field }) => (
                                   <TextField {...field} label="Nombre" fullWidth size="small" margin="normal" error={!!errors.name} helperText={errors.name?.message} />
                              )}
                         />

                         <Controller
                              name="lastname"
                              control={control}
                              rules={{ required: 'El apellido es obligatorio' }}
                              render={({ field }) => (
                                   <TextField {...field} label="Apellido" fullWidth size="small" margin="normal" error={!!errors.lastname} helperText={errors.lastname?.message} />
                              )}
                         />

                         <Controller
                              name="email"
                              control={control}
                              rules={{
                                   required: 'El email es obligatorio',
                                   pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Debe ser un email válido'
                                   }
                              }}
                              render={({ field }) => (
                                   <TextField {...field} label="Email" fullWidth size="small" margin="normal" error={!!errors.email} helperText={errors.email?.message} />
                              )}
                         />

                         <Controller
                              name="password"
                              control={control}
                              rules={{
                                   // La contraseña es opcional al editar un usuario existente
                                   ...(currentUser ? {} : { required: 'La contraseña es obligatoria' }),
                                   minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                              }}
                              render={({ field }) => (
                                   <TextField
                                        {...field}
                                        label={currentUser ? "Nueva contraseña (opcional)" : "Contraseña"}
                                        type="password"
                                        fullWidth
                                        size="small"
                                        margin="normal"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                   />
                              )}
                         />

                         <Controller
                              name="empresas.0.companyRole"
                              control={control}
                              rules={{ required: 'El rol es obligatorio' }}
                              render={({ field }) => (
                                   <TextField
                                        {...field}
                                        label="Rol"
                                        select
                                        fullWidth
                                        size="small"
                                        margin="normal"
                                        error={!!errors.empresas?.[0]?.companyRole}
                                        helperText={errors.empresas?.[0]?.companyRole ? 'El rol es obligatorio' : ''}
                                        disabled={!canEditRole()}
                                   >
                                        {roles
                                             .filter(role => user.systemRole === 'superadmin' || role !== 'admin') // Admin no puede asignar 'admin'
                                             .map(role => (
                                                  <MenuItem key={role} value={role}>
                                                       {role}
                                                  </MenuItem>
                                             ))}
                                   </TextField>
                              )}
                         />

                         <DialogActions>
                              <Button onClick={onClose}>Cancelar</Button>
                              <Button type="submit" variant="contained">{currentUser ? 'Actualizar' : 'Crear'}</Button>
                         </DialogActions>
                    </Box>
               </DialogContent>
          </Dialog>
     );
}