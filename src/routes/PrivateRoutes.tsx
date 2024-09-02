import { Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/dashboard/layout/layout'
import { Page as OverviewPage } from '@/pages/dashboard/overview'

//import { NotFound } from '../app/Dashboard/pages/NotFound'
// import { IndexFactura } from '../Dashboard/pages/factura/IndexFactura'
// import { IndexProducto } from '../Dashboard/pages/producto/IndexProducto'

export const PrivateRoutes = () => {
     return (
          // <Routes>
          //      <Route path='/' element={<Layout children={undefined} />}>
          //           <Route index element={<Home />} />
          //           {/* <Route path="invoices" element={<IndexFactura />} />
          //           <Route path="products" element={<IndexProducto />} /> */}
          //      </Route>
          //      {/* <Route path="/*" element={<NotFound />} /> */}
          // </Routes>
          <Routes>
               <Route path="/" element={<Layout />}>
                    <Route index element={ <OverviewPage /> }
                    />
               </Route>
          </Routes>
     )
}
