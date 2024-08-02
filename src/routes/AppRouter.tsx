import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes';
import { AuthRoutes } from './AuthRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';


export const AppRouter = () => {

     const isAuthenticated = useSelector((state: RootState) => state.authSlice.isAuthenticated);

     return (
          <Routes>
               {
                    (isAuthenticated) 
                    ? <Route path="/*" element={<PrivateRoutes />} />
                    : <Route path="/auth/*" element={<AuthRoutes />} />
               }
               <Route path="*" element={ <Navigate to="/auth/login" />} />  
          </Routes>
     )
}

