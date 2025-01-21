'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { NoSsr } from './no-ssr';
import { RootState } from '@/state/store';
import { useSelector } from 'react-redux';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  
  const {selectedEmpresa} =  useSelector(
    (state: RootState) => state.empresa
  );


  let url: string;

  if (selectedEmpresa?.logo) {
    // Use the logo from Redux if available
    url = selectedEmpresa.logo;
  } else if (emblem) {
    // Fallback to default emblem logos
    url = color === "light" ? "/assets/logo-emblem.svg" : "/assets/logo-emblem--dark.svg";
  } else {
    // Fallback to standard logos
    url = color === "light" ? "/assets/logo.svg" : "/assets/logo--dark.svg";
  }

  // if (emblem) {
  //   url = color === 'light' ? `'/assets/logo-emblem.svg'` : '/assets/logo-emblem--dark.svg';
  // } else {
  //   url = color === 'light' ? '/assets/logo.svg' : '/assets/logo--dark.svg';
  // }

  return <Box alt="logo" component="img" height={height} src={url} width={width} />;
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
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
