'use client'

import { Avatar, Badge, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { FaBell } from 'react-icons/fa';
import { signOutAction } from "@/app/actions";
import { useEffect, useState } from "react";

export default function AuthClient({ user }: { user: any }) {

  const roleId = user.user_metadata?.roleId;
  const [roleName, setRoleName] = useState<string>("");

  useEffect(() => {
    switch (roleId) {
      case 1:
        setRoleName("Administrador");
        break;
      case 2:
        setRoleName("Comprador");
        break;
      case 3:
        setRoleName("Aprobador Jefe");
        break;
      case 4:
        setRoleName("Aprobador Financiero 1");
        break;
      case 5:
        setRoleName("Aprobador Financiero 2");
        break;
      case 6:
        setRoleName("Aprobador Financiero 3");
        break;
      default:
        setRoleName("Error")
    }
  }, [])




  return (
    <div className="w-full sm:px-6 lg:px-8">
      <div className="flex justify-between py-4 max-w-7xl">
        <h1 className="text-2xl font-semibold text-foreground">
          Hola, <span className="font-semibold text-red-500">{user.user_metadata?.full_name}</span>
        </h1>
        <div className="flex items-center gap-x-4">
          <div className="text-left">
            <h4 className="font-bold tracking-wide text-foreground">{user.user_metadata?.full_name}</h4>
            <p className="text-red-500 text-sm">
              {roleName}
            </p>
          </div>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar radius='sm' isBordered as='button' className='transition-transform' />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={"logout"} color='danger' className='text-danger' onPress={signOutAction}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
