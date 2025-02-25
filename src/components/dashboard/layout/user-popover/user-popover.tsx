import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { LockKey as LockKeyIcon } from '@phosphor-icons/react/dist/ssr/LockKey';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

// import type { UserProfile } from '@/types/user';
import { config } from '@/config';
import { paths } from '@/paths';
import { AuthStrategy } from '@/lib/auth/strategy';
import { RouterLink } from '@/components/core/link';

import { CustomSignOut } from './custom-sign-out';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import BusinessIcon from '@mui/icons-material/Business';
import { resetEmpresaState } from '@/state/slices/empresaSlice';

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authSlice.user);
  const selectEmpresa = useSelector((state: RootState) => state.empresaSlice.selectedEmpresa);
  const hasMultipleEmpresas = (user?.empresas ?? []).length > 1;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{user?.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>

        {user?.systemRole === 'superadmin' ? (
          <MenuItem
            component={RouterLink}
            href="/admin/dashboard/empresas"
            onClick={() => {
              dispatch(resetEmpresaState());
              onClose?.();
            }}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            Empresas
          </MenuItem>
        ) : (
          hasMultipleEmpresas && (
            <MenuItem
              component={RouterLink}
              href="/empresa"
              onClick={() => {
                dispatch(resetEmpresaState());
                onClose?.();
              }}
            >
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              Empresas
            </MenuItem>
          )
        )}

        <MenuItem component={RouterLink} href={paths.dashboard.settings.account(selectEmpresa.id)} onClick={onClose}>
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.settings.security(selectEmpresa.id)} onClick={onClose}>
          <ListItemIcon>
            <LockKeyIcon />
          </ListItemIcon>
          Security
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.settings.billing(selectEmpresa.id)} onClick={onClose}>
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          Billing
        </MenuItem>
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        {config.auth.strategy === AuthStrategy.CUSTOM ? <CustomSignOut /> : null}
      </Box>
    </Popover>
  );
}
