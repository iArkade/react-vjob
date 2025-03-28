import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLoginHistory, useSaveLoginHistory } from '@/api/security/login-history-request';
import { RootState } from '@/state/store';
import { useDispatch, useSelector } from 'react-redux';
import LoginHistory from '@/components/dashboard/settings/login-history';
import { setJustLoggedIn } from '@/state/slices/authSlice';
import { Alert, Box, CircularProgress } from '@mui/material';


export function Security(): React.JSX.Element {
     const dispatch = useDispatch();
     const user = useSelector((state: RootState) => state.authSlice.user);
     const justLoggedIn = useSelector((state: RootState) => state.authSlice.justLoggedIn);

     const [page, setPage] = React.useState(0);
     const rowsPerPage = 10;

     const { data, refetch, isLoading, error } = useLoginHistory(page, rowsPerPage);
     const { mutate: saveLogin } = useSaveLoginHistory();

     React.useEffect(() => {
          if (user?.id && justLoggedIn) {
               saveLogin(
                    {
                         userId: user.id,
                         userName: `${user.name} ${user.lastname}`
                    },
                    {
                         onSuccess: () => {
                              refetch()
                              dispatch(setJustLoggedIn(false));
                         },
                         onError: (err) => console.error('Error al guardar login:', err),
                    }
               );
          }
     }, [user, justLoggedIn]);

     const handlePageChange = (newPage: number) => {
          setPage(Math.max(0, newPage));
     };

     if (isLoading) {
          return (
               <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
               >
                    <CircularProgress />
                    <Typography sx={{ ml: 1 }}>Cargando...</Typography>
               </Box>
          );
     }

     if (error) {
          return <Alert severity="error">Error al cargar el historial</Alert>;
     }

     return (
          <Stack spacing={4}>
               <Typography variant="h4">Security</Typography>
               <LoginHistory
                    logins={data?.data || []}
                    total={data?.total || 0}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
               />
          </Stack>
     );
}