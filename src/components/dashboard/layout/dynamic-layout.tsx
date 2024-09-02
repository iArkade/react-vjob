'use client';

import * as React from 'react';

import { useSettings } from '@/hooks/use-settings';

import { HorizontalLayout } from './horizontal_bar/horizontal-layout';
import { VerticalLayout } from './vertical_bar/vertical-layout';

export interface DynamicLayoutProps {
  children: React.ReactNode;
}

export function DynamicLayout({ children }: DynamicLayoutProps): React.JSX.Element {
  const { settings } = useSettings();

  return settings.layout === 'horizontal' ? (
    <HorizontalLayout>{children}</HorizontalLayout>
  ) : (
    <VerticalLayout>{children}</VerticalLayout>
  );
}
