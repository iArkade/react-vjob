import { Route, Routes } from 'react-router-dom'

import { Home } from '../app/Dashboard/pages/Home'
import { Layout } from '@/components/dashboard/layout/layout'

//import { NotFound } from '../app/Dashboard/pages/NotFound'
// import { IndexFactura } from '../Dashboard/pages/factura/IndexFactura'
// import { IndexProducto } from '../Dashboard/pages/producto/IndexProducto'

export const PrivateRoutes = () => {
     return (
          <Routes>
               <Route path='/' element={<Layout children={undefined} />}>
                    <Route index element={<Home />} />
                    {/* <Route path="invoices" element={<IndexFactura />} />
                    <Route path="products" element={<IndexProducto />} /> */}
               </Route>
               {/* <Route path="/*" element={<NotFound />} /> */}
          </Routes>
     )
}
