import { Route, Routes } from "react-router-dom"
import LoginPage from "../auth/pages/LoginPage"
import RegisterPage from "../auth/pages/RegisterPage"

export const AuthRoutes = () => {
     return (
          <Routes>
               <Route path="login" element={<LoginPage />} />
               <Route path="register" element={<RegisterPage />} />
          </Routes>
     )
}
