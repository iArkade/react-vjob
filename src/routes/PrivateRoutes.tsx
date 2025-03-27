import { Navigate, Route, Routes, useParams } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { OverviewPage } from '@/pages/dashboard/overview'
// import {Page as Analytics} from '@/pages/dashboard/analytics'
import { PlanCuentas } from '@/pages/dashboard/plan-cuentas'
import { Transaction } from '@/pages/dashboard/transaction'
import { CostCenter } from '@/pages/dashboard/costCenter'
import { Asientos } from '@/pages/dashboard/asientos/index'
import { AsientosCreate } from '@/pages/dashboard/asientos/create'
import { AsientosShow } from '@/pages/dashboard/asientos/show'
import { AsientosPDF } from '@/pages/dashboard/asientos/pdf'
import { Account } from '@/pages/dashboard/settings/account'
import { LayoutSettings } from '@/components/dashboard/settings/layout'
import { Company } from '@/pages/dashboard/settings/company'
import { Usuarios } from '@/pages/dashboard/usuarios'
import { NotFound } from '@/pages/not-found'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import PerdidasGanancias from '@/pages/dashboard/informes/perdidas-ganancias'
import { Security } from '@/pages/dashboard/settings/security'
import BalanceGeneral from '@/pages/dashboard/informes/balance-general'

export const PrivateRoutes = () => {
     const { empresaId } = useParams(); // Obtener el empresaId de la URL
     const selectedEmpresa = useSelector((state: RootState) => state.empresaSlice.selectedEmpresa);

     // Verificar si el empresaId de la URL coincide con la empresa seleccionada
     if (selectedEmpresa?.id !== Number(empresaId)) {
          return <Navigate to={`/empresa/${selectedEmpresa?.id}/dashboard`} />;
     }
     

     return (
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={<OverviewPage />} />
                    <Route path="/settings" element={<LayoutSettings />}>
                         <Route path='account' element={<Account />} />
                         <Route path='security' element={<Security />} />
                         <Route path='company' element={<Company />} />
                    </Route>

                    <Route path='usuarios' element={<Usuarios />} />
                    <Route path='plan-cuentas' element={<PlanCuentas />} />
                    <Route path='transacciones' element={<Transaction />} />
                    <Route path='centro-costos' element={<CostCenter />} />
                    <Route path='asientos' element={<Asientos />} />
                    <Route path='asientos/:id' element={<AsientosShow />} />
                    <Route path='asientos/create' element={<AsientosCreate />} />
                    <Route path='asientos/pdf/:id' element={<AsientosPDF />} />
                    <Route path='perdidas-ganancias' element={<PerdidasGanancias />} />
                    <Route path='balance-general' element={<BalanceGeneral />} />
                    {/* <Route path='blank' element={ <Blank /> }/> */}
                    {/* <Route path='analytics' element={ <Analytics /> }/> */}

                    <Route path="*" element={<NotFound />} />
               </Route>
          </Routes>
     )
}
