'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { NoSsr } from './no-ssr';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number | string;
  width?: number | string;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  

  const { user } = useSelector((state: RootState) => state.authSlice);
  const { selectedEmpresa } = useSelector((state: RootState) => state.empresaSlice);
  
  let url: string;

  if (selectedEmpresa.logo) {
    // Use the logo from Redux if available
    url = selectedEmpresa.logo;
  } else {
    // Use the default logo
    url = "http://localhost:4000/uploads/logos/logo-principal.png";
  }

  return <Box alt="logo" component="img" height={height} src={url} width={width} margin={'auto'} />;
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: '100%' }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
