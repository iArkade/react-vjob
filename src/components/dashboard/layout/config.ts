import { paths } from '@/paths';
import { NavItemConfig } from '@/types/nav';

const superadminNavItems: NavItemConfig[] = [
     {
          key: 'management',
          title: 'Gestión',
          items: [
               { key: 'companies', title: 'Empresas', href: paths.admin.empresas, icon: 'building' },
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

const regularNavItems: NavItemConfig[] = [
     {
          key: 'contabilidad',
          title: 'Contabilidad',
          items: [
               { key: 'plan-cuentas', title: 'Plan de Cuentas', href: paths.dashboard.planCuentas, icon: 'read-cv-logo' },
               { key: 'transaction', title: 'Transacciones', href: paths.dashboard.transacciones, icon: 'cube' },
               { key: 'costCenter', title: 'Centro de Costos', href: paths.dashboard.centroCostos, icon: 'cube' },
               { key: 'asiento', title: 'Asientos', href: paths.dashboard.asientos.index, icon: 'cube' },
          ],
     },
     {
          key: 'dashboards',
          title: 'Dashboards',
          items: [
               { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'house' },
               { key: 'usuarios', title: 'Usuarios', href: paths.dashboard.usuarios, icon: 'users' },
          ],
     },
     {
          key: 'settings',
          title: 'Configuración',
          items: [
               {
                    key: 'settings',
                    title: 'Ajustes',
                    href: paths.dashboard.settings.account,
                    icon: 'gear',
               },
          ],
     },
];

export const getLayoutConfig = (role: string) => ({
     navItems: role === 'superadmin' ? superadminNavItems : regularNavItems,
});