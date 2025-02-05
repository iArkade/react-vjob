import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import useAuth from "../hooks/use-auth";
import { Empresa } from "@/pages/core/empresa";
import { AdminRoutes } from "./AdminRoutes";

export const AppRouter = () => {
  const loading = useAuth(); 
  const isAuthenticated = useSelector(
    (state: RootState) => state.authSlice.isAuthenticated
  );

  const user = useSelector(
    (state: RootState) => state.authSlice.user
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {user?.superAdmin && isAuthenticated ?  (
        <Route path="/admin/*" element={<AdminRoutes />} />
      ) : isAuthenticated ? (
        <>
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/dashboard/*" element={<PrivateRoutes />} />
          <Route path="*" element={<Navigate to="/empresa" />} />
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
