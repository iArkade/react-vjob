import React, { useMemo, useState } from 'react';
import {
     Table,
     TableBody,
     TableCell,
     TableContainer,
     TableHead,
     TableRow,
     TablePagination,
     IconButton,
     Box,
     Avatar,
     Chip,
     Tooltip,
} from '@mui/material';
import {
     Edit as EditIcon,
     Delete as DeleteIcon,
} from '@mui/icons-material';
import { UsuarioResponseType } from '@/api/user-types';


interface UsuariosTableProps {
     users: UsuarioResponseType[];
     searchTerm: string;
     onEdit: (user: UsuarioResponseType) => void;
     onDelete: (userId: number) => void;
     user: {
          id: number;
          systemRole: string;
          empresas: { role: string }[];
     };
}

// Componente para los botones de acción
const ActionButtons = ({
     targetUser,
     onEdit,
     onDelete,
     canEdit,
     canDelete
}: {
     targetUser: UsuarioResponseType;
     onEdit: (user: UsuarioResponseType) => void;
     onDelete: (userId: number) => void;
     canEdit: boolean;
     canDelete: boolean;
}) => (
     <>
          {canEdit && (
               <Tooltip title="Editar" arrow>
                    <IconButton color="primary" onClick={() => onEdit(targetUser)}>
                         <EditIcon />
                    </IconButton>
               </Tooltip>
          )}
          {canDelete && (
               <Tooltip title="Eliminar" arrow>
                    <IconButton color="error" onClick={() => onDelete(targetUser.id)}>
                         <DeleteIcon />
                    </IconButton>
               </Tooltip>
          )}
     </>
);
export function UsuarioTable({ users, searchTerm, onEdit, onDelete, user }: UsuariosTableProps) {
     const [page, setPage] = useState<number>(0);
     const [rowsPerPage, setRowsPerPage] = useState<number>(10);
     
     // Funciones de utilidad para roles y permisos
     const isSuperAdmin = user.systemRole === 'superadmin';
     const isAdmin = user.empresas[0]?.role === 'admin';

     const isCurrentUser = (targetUser: UsuarioResponseType): boolean =>
          targetUser.id === user.id;

     const isUserAdmin = (targetUser: UsuarioResponseType): boolean =>
          targetUser.empresas[0]?.companyRole === 'admin';

     const isUserSuperAdmin = (targetUser: UsuarioResponseType): boolean =>
          targetUser.systemRole === 'superadmin';

     // Funciones para determinar permisos
     const canEdit = (targetUser: UsuarioResponseType): boolean => {
          // El usuario siempre puede editarse a sí mismo
          if (isCurrentUser(targetUser)) return true;

          // Un superadmin puede editar a cualquiera
          if (isSuperAdmin) return true;

          // Un admin puede editar usuarios pero no a otros admins
          if (isAdmin) return !isUserAdmin(targetUser) && !isUserSuperAdmin(targetUser);

          // Usuarios normales no pueden editar a otros
          return false;
     };

     const canDelete = (targetUser: UsuarioResponseType): boolean => {
          // Nadie puede eliminar su propia cuenta
          if (isCurrentUser(targetUser)) return false;

          // Un superadmin puede eliminar a cualquiera excepto a sí mismo
          if (isSuperAdmin) return true;

          // Un admin puede eliminar usuarios normales, pero no a otros admins ni superadmins
          if (isAdmin) return !isUserAdmin(targetUser) && !isUserSuperAdmin(targetUser);

          // Usuarios normales no pueden eliminar cuentas
          return false;
     };

     // Filtrar y ordenar usuarios (memorizado para evitar recálculos innecesarios)
     const filteredUsers = useMemo(() => {
          return users
               .filter((u) => {
                    // Excluir al usuario actual
                    if (u.id === user.id) return false;

                    // Si es superadmin, puede ver todos los usuarios
                    if (user.systemRole === 'superadmin') return true;

                    // Si es admin, solo puede ver los usuarios que él creó
                    if (user.empresas[0]?.role === 'admin') {
                         return u.createdBy !== null && u.createdBy?.id === user.id;
                    }

                    // Usuarios normales no pueden ver a nadie
                    return false;
               })
               .filter((u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.empresas[0]?.companyRole || '').toLowerCase().includes(searchTerm.toLowerCase())
               );
     }, [users, searchTerm, user.id, user.systemRole, user.empresas]);

     // Manejadores de eventos para paginación
     const handleChangePage = (_: unknown, newPage: number): void => {
          setPage(newPage);
     };

     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
     };

     // Cálculo de usuarios para la página actual
     const paginatedUsers = useMemo(() => {
          return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
     }, [filteredUsers, page, rowsPerPage]);

     return (
          <>
               <TableContainer>
                    <Table>
                         <TableHead>
                              <TableRow sx={{ bgcolor: 'primary.light' }}>
                                   <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                                   <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                   <TableCell sx={{ color: 'white' }}>Rol</TableCell>
                                   <TableCell sx={{ color: 'white' }}>Estado</TableCell>
                                   <TableCell align="right" sx={{ color: 'white' }}>Acciones</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {paginatedUsers.map((u) => {
                                   return (
                                        <TableRow
                                             key={u.id}
                                             hover
                                        >
                                             <TableCell>
                                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                       <Avatar sx={{ mr: 2 }}>{u.name[0]}</Avatar>
                                                       {`${u.name} ${u.lastname || ''}`}
                                                  </Box>
                                             </TableCell>
                                             <TableCell>{u.email}</TableCell>
                                             <TableCell>{u.empresas[0]?.companyRole || 'Sin rol'}</TableCell>
                                             <TableCell>
                                                  <Chip
                                                       label={u.active ? 'Activo' : 'Inactivo'}
                                                       color={u.active ? 'success' : 'error'}
                                                  />
                                             </TableCell>
                                             <TableCell align="right">
                                                  <ActionButtons
                                                       targetUser={u}
                                                       onEdit={onEdit}
                                                       onDelete={onDelete}
                                                       canEdit={canEdit(u)}
                                                       canDelete={canDelete(u)}
                                                  />
                                             </TableCell>
                                        </TableRow>
                                   );
                              })}
                         </TableBody>
                    </Table>
               </TableContainer>
               <TablePagination
                    rowsPerPageOptions={[10, 15, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
               />
          </>
     );
}