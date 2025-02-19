import { paths } from '@/paths';
import { NavItemConfig } from '@/types/nav';

const superadminNavItems: NavItemConfig[] = [
     {
          key: 'management',
          title: 'Gestión',
          items: [
               { key: 'companies', title: 'Empresas', href: paths.admin.empresas, icon: 'building-office' },
               { key: 'users', title: 'Usuarios', href: paths.admin.usuarios, icon: 'users' },
               { key: 'overview', title: 'Dashboard', href: paths.admin.dashboard, icon: 'chart-bar' },
          ],
     },
     {
          key: 'settings',
          title: 'Configuración',
          items: [
               {
                    key: 'settings',
                    title: 'Ajustes',
                    href: paths.admin.settings.account,
                    icon: 'gear',
               },
          ],
     },
];

const AdminNavItems = (empresaId: string | number): NavItemConfig[] => [
     {
          key: 'contabilidad',
          title: 'Contabilidad',
          items: [
               { key: 'plan-cuentas', title: 'Plan de Cuentas', href: paths.dashboard.planCuentas(empresaId), icon: 'read-cv-logo' },
               { key: 'transaction', title: 'Transacciones', href: paths.dashboard.transacciones(empresaId), icon: 'cube' },
               { key: 'costCenter', title: 'Centro de Costos', href: paths.dashboard.centroCostos(empresaId), icon: 'cube' },
               { key: 'asiento', title: 'Asientos', href: paths.dashboard.asientos.index(empresaId), icon: 'cube' },
          ],
     },
     {
          key: 'dashboards',
          title: 'Dashboards',
          items: [
               { key: 'overview', title: 'Overview', href: paths.dashboard.overview(empresaId), icon: 'house' },
               { key: 'usuarios', title: 'Usuarios', href: paths.dashboard.usuarios(empresaId), icon: 'users' },
          ],
     },
     {
          key: 'settings',
          title: 'Configuración',
          items: [
               {
                    key: 'settings',
                    title: 'Ajustes',
                    href: paths.dashboard.settings.account(empresaId),
                    icon: 'gear',
               },
          ],
     },
];
const regularNavItems = (empresaId: string | number): NavItemConfig[] => [
     {
          key: 'contabilidad',
          title: 'Contabilidad',
          items: [
               { key: 'plan-cuentas', title: 'Plan de Cuentas', href: paths.dashboard.planCuentas(empresaId), icon: 'read-cv-logo' },
               { key: 'transaction', title: 'Transacciones', href: paths.dashboard.transacciones(empresaId), icon: 'cube' },
               { key: 'costCenter', title: 'Centro de Costos', href: paths.dashboard.centroCostos(empresaId), icon: 'cube' },
               { key: 'asiento', title: 'Asientos', href: paths.dashboard.asientos.index(empresaId), icon: 'cube' },
          ],
     },
     {
          key: 'dashboards',
          title: 'Dashboards',
          items: [
               { key: 'overview', title: 'Overview', href: paths.dashboard.overview(empresaId), icon: 'house' },
          ],
     },
];


export const getLayoutConfig = (
     systemRole: string, // 'superadmin' o 'user'
     companyRole: string, // 'admin' o 'user'
     empresaId: string | number // ID de la empresa seleccionada
): NavItemConfig[] => { // devolver un array de NavItemConfig
     if (systemRole === 'superadmin') {
          return superadminNavItems; // superadminNavItems ya es un array
     }

     if (systemRole === 'user') {
          if (companyRole === 'admin') {
               return AdminNavItems(empresaId); // AdminNavItems(empresaId) devuelve un array
          } else if (companyRole === 'user') {
               return regularNavItems(empresaId); // regularNavItems(empresaId) devuelve un array
          }
     }

     // Por defecto, devuelve un array vacío
     return [];
};