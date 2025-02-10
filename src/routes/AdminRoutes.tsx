import { Layout } from "@/components/dashboard/layout/layout";
import { LayoutSettings } from "@/components/dashboard/settings/layout";
import GestionEmpresas from "@/pages/dashboard/admin/gestion-empresas";
import { GestionUsuarios } from "@/pages/dashboard/admin/gestion-usuarios";
import { OverviewPage } from "@/pages/dashboard/overview";
import { Account } from "@/pages/dashboard/settings/account";
import { Company } from "@/pages/dashboard/settings/company";
import { Route, Routes } from "react-router-dom";

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Layout />}>
                <Route index element={<OverviewPage />} />
                <Route path="settings" element={<LayoutSettings />}>
                    <Route path='account' element={<Account />} />
                    <Route path='company' element={<Company />} />
                </Route>
                <Route path="empresas" element={<GestionEmpresas />} />
                <Route path="usuarios" element={<GestionUsuarios />} />
            </Route>
        </Routes>
    );
};