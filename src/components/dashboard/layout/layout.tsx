import * as React from 'react';

import { DynamicLayout } from './dynamic-layout';
import { Outlet } from 'react-router-dom';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export function Layout({ children }: LayoutProps): React.JSX.Element {
//   return (

//       <DynamicLayout>{children}</DynamicLayout>

//   );
// }

export function Layout(): React.JSX.Element {
  return (
    <DynamicLayout />
  );
}