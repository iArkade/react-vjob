'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';

import { Rtl } from './rtl';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function CustomThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {

  const theme = createTheme({
    primaryColor: 'neonBlue',
    colorScheme: 'light',
    direction: 'ltr',
  });

  return (
    <ThemeProvider theme={theme}>
      {/* <Helmet>
        <meta content={settings.colorScheme} name="color-scheme" />
      </Helmet> */}
      <CssBaseline />
      <Rtl direction="ltr">{children}</Rtl>
    </ThemeProvider>
  );
}
