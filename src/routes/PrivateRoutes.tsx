import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { Page as OverviewPage } from '@/pages/dashboard/overview'
import {Page as Analytics} from '@/pages/dashboard/analytics'
import {Page as Blank} from '@/pages/dashboard/blank'

export const PrivateRoutes = () => {
     
     return (
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={ <OverviewPage /> }/>
                    <Route path='analytics' element={ <Analytics /> }/>
                    <Route path='blank' element={ <Blank /> }/>
               </Route>
          </Routes>
     )
}
