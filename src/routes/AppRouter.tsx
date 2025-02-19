import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { Empresa } from "@/pages/core/empresa";
import { AdminRoutes } from "./AdminRoutes";

export const AppRouter = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.authSlice);
  const selectedEmpresa = useSelector((state: RootState) => state.empresaSlice.selectedEmpresa);


  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    );
  }

  if (user?.role === 'superadmin') {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    );
  }

  if (!selectedEmpresa?.id) {
    return (
      <Routes>
        <Route path="/empresa" element={<Empresa />} />
        <Route path="*" element={<Navigate to="/empresa" />} />
      </Routes>
    );
  }

  return (
      <Routes>
        <Route path="/empresa/:empresaId/dashboard/*" element={<PrivateRoutes />} />
        <Route path="*" element={<Navigate to={`/empresa/${selectedEmpresa.id}/dashboard`} />} />
      </Routes>
  );
};