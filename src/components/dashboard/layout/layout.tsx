import * as React from 'react';

import { DynamicLayout } from './dynamic-layout';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (

      <DynamicLayout>{children}</DynamicLayout>

  );
}
