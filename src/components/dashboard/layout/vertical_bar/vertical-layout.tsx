'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Outlet } from 'react-router-dom';

import { useSettings } from '@/hooks/use-settings';
import { getLayoutConfig } from '../config';
import { MainNav } from './main-nav';
import { SideNav } from './side-nav';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

export function VerticalLayout(): React.JSX.Element {
  const { user } = useSelector((state: RootState) => state.authSlice);
  const layoutConfig = getLayoutConfig(user?.role || 'user');
  const { settings } = useSettings();
  

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
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
        <SideNav color={settings.navColor} items={layoutConfig.navItems} />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav items={layoutConfig.navItems} />
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
      </Box>
    </React.Fragment>
  );
}
