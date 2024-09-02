'use client';

import * as React from 'react';
import { useSettings } from '@/hooks/use-settings';

import { HorizontalLayout } from './horizontal_bar/horizontal-layout';
import { VerticalLayout } from './vertical_bar/vertical-layout';

export function DynamicLayout(): React.JSX.Element {
  const { settings } = useSettings();
  return settings.layout === 'horizontal' ? (
    <HorizontalLayout />
  ) : (
    <VerticalLayout />
  );
}