import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import SidebarWrapper from "@/components/sidebar-wrapper";
import { ThemeSwitcher } from "@/components/theme-switcher";
import AuthWrapper from "@/components/auth-wrapper";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const roleId = user.user_metadata?.roleId;

  return (
    <div className="flex min-h-screen container">
      <SidebarWrapper roleId={roleId} />
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center mb-4">
          <AuthWrapper />
          <ThemeSwitcher />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
