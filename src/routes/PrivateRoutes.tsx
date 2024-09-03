import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { Page as OverviewPage } from '@/pages/dashboard/overview'

export const PrivateRoutes = () => {
     return (
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={ <OverviewPage /> }
                    />
               </Route>
          </Routes>
     )
}
