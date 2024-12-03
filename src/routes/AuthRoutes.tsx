import { Route, Routes } from "react-router-dom"
import LoginPage from "../auth/pages/LoginPage"
import RegisterPage from "../auth/pages/RegisterPage"
import { AuthLayout } from '../auth/pages/AuthLayout';
import { RegisterCompanyPage } from "@/auth/pages/RegisterCompanyPage";


export const AuthRoutes = () => {
     return (
          <Routes>
               <Route path="/" element={<AuthLayout />}>
                    <Route index element={<LoginPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="empresa" element={<RegisterCompanyPage />} />
               </Route>
          </Routes>
     );
};
