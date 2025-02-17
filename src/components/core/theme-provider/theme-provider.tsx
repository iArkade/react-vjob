'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';

import { Rtl } from './rtl';
import { useMediaQuery } from '@mui/material';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function CustomThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {

  // 1. Detectar si el sistema prefiere un tema oscuro
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');  

  // 2. Estado para manejar el modo del tema
  const [themeMode, setThemeMode] = React.useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  // 3. Función para alternar entre temas
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    primaryColor: 'neonBlue',
    colorScheme: themeMode,
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
