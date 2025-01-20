import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import useAuth from "../hooks/use-auth";
import { useState, useEffect } from "react";
import { Page as Empresa } from "@/pages/core/empresa";
import EntityDetails from "@/pages/entityDetails";

export const AppRouter = () => {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.authSlice.isAuthenticated
  );

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
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/dashboard/*" element={<PrivateRoutes />} />
          <Route path="*" element={<Navigate to="/empresa" />} />
          <Route path="/entity/:id" element={<EntityDetails />} />
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
