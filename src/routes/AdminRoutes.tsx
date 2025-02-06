import { Layout } from '@/components/dashboard/layout/layout'
import { EmpresasAdmin } from '@/pages/admin/crear-empresas'
import { UsuariosAdmin } from '@/pages/admin/crear-usuarios'
import { DashboardAdmin } from '@/pages/admin/dashboard'

import { Route, Routes } from 'react-router-dom'

export const AdminRoutes = () => {
     return (
          <Routes>
               {/* <Route path="/" element={<Layout isAdmin={true} />} /> */}
               <Route path="/" element={<Layout />}>
                    <Route index element={ <DashboardAdmin /> }/>
                    <Route path="usuarios" element={ <UsuariosAdmin /> }/>
                    <Route path="empresas" element={ <EmpresasAdmin /> }/>
               </Route>
          </Routes>          
     )
}
