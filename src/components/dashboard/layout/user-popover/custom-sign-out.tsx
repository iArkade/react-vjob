'use client';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';

import { authClient } from '@/lib/auth/custom/client';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useLogoutUser } from '@/api/user-request';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '@/state/slices/authSlice';

export function CustomSignOut(): React.JSX.Element {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync: logout } = useLogoutUser();

  const handleSignOut = async () => {
    try {

      //const { error } = await authClient.signOut();
      // if (error) {
      //   logger.error('Sign out error', error);
      //   toast.error('Something went wrong, unable to sign out');
      //   return;
      // }

      await logout();
      localStorage.removeItem('token');
      dispatch(setAuthenticated({ isAuthenticated: false }));
      navigate('/login');


    } catch (err) {
      logger.error('Sign out error', err);
      toast.error('Something went wrong, unable to sign out');
    }
  };

  return (
    <MenuItem component="div" onClick={handleSignOut} sx={{ justifyContent: 'center' }}>
      Sign out
    </MenuItem>
  );
}
