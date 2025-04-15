'use client';

import Sidebar from './sidebar';
import { FaUser, FaChartBar, FaShoppingCart, FaHome, FaBook, FaList } from "react-icons/fa";

export type MenuItem = {
  title: string;
  icon: React.ElementType;
  url: string;
};

type Props = {
  roleId: number;
};

export default function SidebarWrapper({ roleId }: Props) {
  const menus: MenuItem[] =
  roleId === 2 ?
  [
    { title: "Crear Solicitud", icon: FaShoppingCart, url: "/dashboard/comprador/create" },
    { title: "Solicitudes", icon: FaBook, url: "/dashboard/comprador/solicitudes" },
  ] : roleId === 3 ?
  [
    { title: "Solicitudes", icon: FaList, url: "/dashboard/aprobadorjefe/solicitudes" },
    { title: "Historial", icon: FaBook, url: "/dashboard/aprobadorjefe/historial" },
  ] : roleId === 4 || roleId === 5 || roleId === 6 ?
  [
    { title: "Solicitudes", icon: FaList, url: "/dashboard/financiero/solicitudes" },
    { title: "Historial", icon: FaBook, url: "/dashboard/financiero/historial" },
  ]
  :
  [
  ]

  return <Sidebar menus={menus} />;
}