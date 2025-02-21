'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { useSettings } from '@/hooks/use-settings';

import { getLayoutConfig } from '../config';
import { MainNav } from './main-nav';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';


export function HorizontalLayout(): React.JSX.Element {

  const { user } = useSelector((state: RootState) => state.authSlice);
  const systemRole = user?.systemRole || 'user';
  const selectedEmpresa = useSelector((state: RootState) => state.empresaSlice.selectedEmpresa);
  const companyRole = selectedEmpresa?.companyRole || 'user'; // Si no hay empresa seleccionada, asume 'user'

  const layoutConfig = getLayoutConfig(systemRole, companyRole, selectedEmpresa?.id);

  
  const { settings } = useSettings();

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ body: { '--MainNav-zIndex': 1000, '--MobileNav-width': '320px', '--MobileNav-zIndex': 1100 } }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <MainNav color={settings.navColor} items={layoutConfig} />
        <Box
          component="main"
          sx={{
            '--Content-margin': '0 auto',
            '--Content-maxWidth': 'var(--maxWidth-xl)',
            '--Content-paddingX': '24px',
            '--Content-paddingY': { xs: '24px', lg: '64px' },
            '--Content-padding': 'var(--Content-paddingY) var(--Content-paddingX)',
            '--Content-width': '100%',
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </React.Fragment>
  );

}
