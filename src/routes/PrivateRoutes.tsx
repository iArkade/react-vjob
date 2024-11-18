import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { Page as OverviewPage } from '@/pages/dashboard/overview'
import {Page as Analytics} from '@/pages/dashboard/analytics'
import {Page as Blank} from '@/pages/dashboard/blank'
import {Page as Transaction} from '@/pages/dashboard/transaction'
import {Page as CostCenter} from '@/pages/dashboard/costCenter'
import {Page as Asientos} from '@/pages/dashboard/asientos/index'
import {Page as AsientosCreate} from '@/pages/dashboard/asientos/create'
import {Page as AsientosShow} from '@/pages/dashboard/asientos/show'

export const PrivateRoutes = () => {
     
     return (
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={ <OverviewPage /> }/>
                    <Route path='analytics' element={ <Analytics /> }/>
                    <Route path='transaction' element={ <Transaction /> }/>
                    <Route path='costCenter' element={ <CostCenter /> }/>
                    <Route path='blank' element={ <Blank /> }/>
                    <Route path='asientos' element={ <Asientos /> }/>
                    <Route path='asientos/:id' element={ <AsientosShow /> }/>
                    <Route path='asientos/create' element={ <AsientosCreate /> }/>
               </Route>
          </Routes>
     )
}
