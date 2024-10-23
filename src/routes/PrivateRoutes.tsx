import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { Page as OverviewPage } from '@/pages/dashboard/overview'
import {Page as Analytics} from '@/pages/dashboard/analytics'
import {Page as Blank} from '@/pages/dashboard/blank'
import {Page as Transaction} from '@/pages/dashboard/transaction'
import {Page as Asientos} from '@/pages/dashboard/asientos'

export const PrivateRoutes = () => {
     
     return (
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={ <OverviewPage /> }/>
                    <Route path='analytics' element={ <Analytics /> }/>
                    <Route path='transaction' element={ <Transaction /> }/>
                    <Route path='blank' element={ <Blank /> }/>
                    <Route path='asientos' element={ <Asientos /> }/>
               </Route>
          </Routes>
     )
}
