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

  // Si el usuario es superadmin
  if (user?.systemRole === 'superadmin') {
    // Si el superadmin tiene una empresa seleccionada, redirigir al dashboard de la empresa
    if (selectedEmpresa?.id) {
      return (
        <Routes>
          <Route path="/empresa/:empresaId/dashboard/*" element={<PrivateRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<Navigate to={`/empresa/${selectedEmpresa.id}/dashboard`} />} />
        </Routes>
      );
    }

    // Si el superadmin no tiene una empresa seleccionada, redirigir a la tabla de empresas
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/admin/dashboard/empresas" />} />
      </Routes>
    );
  }

  // Si el usuario no es superadmin y no tiene una empresa seleccionada, redirigir a la página de selección de empresa
  if (!selectedEmpresa?.id) {
    return (
      <Routes>
        <Route path="/empresa" element={<Empresa />} />
        <Route path="*" element={<Navigate to="/empresa" />} />
      </Routes>
    );
  }

  // Si el usuario no es superadmin pero tiene una empresa seleccionada, redirigir al dashboard de la empresa
  return (
    <Routes>
      <Route path="/empresa/:empresaId/dashboard/*" element={<PrivateRoutes />} />
      <Route path="*" element={<Navigate to={`/empresa/${selectedEmpresa.id}/dashboard`} />} />
    </Routes>
  );
};