import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { AuthRoutes } from './AuthRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import useAuth from '../hooks/use-auth';
import { useState, useEffect } from 'react';

export const AppRouter = () => {
     const [loading, setLoading] = useState(true);
     const isAuthenticated = useSelector((state: RootState) => state.authSlice.isAuthenticated);
     //const location = useLocation(); // Get the current location

     useAuth();

     useEffect(() => {
          setLoading(false);
     }, [isAuthenticated]);

     if (loading) {
          return <div>Loading...</div>;
     }

     return (
          <Routes>
               {isAuthenticated ? (
                    <>
                         <Route path="/dashboard/*" element={<PrivateRoutes />} />
                         <Route path="*" element={<Navigate to="/dashboard" />} />
                    </>
               ) : (
                    <>
                         <Route path="/auth/*" element={<AuthRoutes />} />
                         <Route path="*" element={<Navigate to="/auth/login" />} />
                    </>
               )}
          </Routes>
     );
};
