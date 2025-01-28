import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { OverviewPage } from '@/pages/dashboard/overview'
// import {Page as Analytics} from '@/pages/dashboard/analytics'
import {PlanCuentas} from '@/pages/dashboard/plan-cuentas'
import {Transaction} from '@/pages/dashboard/transaction'
import {CostCenter} from '@/pages/dashboard/costCenter'
import {Asientos} from '@/pages/dashboard/asientos/index'
import {AsientosCreate} from '@/pages/dashboard/asientos/create'
import {AsientosShow} from '@/pages/dashboard/asientos/show'
import {AsientosPDF} from '@/pages/dashboard/asientos/pdf'
import { Account } from '@/pages/dashboard/settings/account'
import { LayoutSettings } from '@/components/dashboard/settings/layout'
import { Company } from '@/pages/dashboard/settings/company'

export const PrivateRoutes = () => {
     
     return (
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={ <OverviewPage /> }/>AccountDetails
                    <Route path="/settings" element={<LayoutSettings />}>
                         <Route path='account' element={ <Account /> }/>
                         <Route path='company' element={ <Company /> }/>
                    </Route>
                    <Route path='plan-cuentas' element={ <PlanCuentas /> }/>
                    <Route path='transacciones' element={ <Transaction /> }/>
                    <Route path='centro-costos' element={ <CostCenter /> }/>
                    <Route path='asientos' element={ <Asientos /> }/>
                    <Route path='asientos/:id' element={ <AsientosShow /> }/>
                    <Route path='asientos/create' element={ <AsientosCreate /> }/>
                    <Route path='asientos/pdf/:id' element={ <AsientosPDF /> }/>
                    <Route path='asientos/pdf/:id' element={ <AsientosPDF /> }/>
                    {/* <Route path='blank' element={ <Blank /> }/> */}
                    {/* <Route path='analytics' element={ <Analytics /> }/> */}            
               </Route>
          </Routes>
     )
}
