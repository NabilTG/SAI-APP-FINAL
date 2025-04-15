'use client';

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";
import AuthWrapper from "@/components/auth-wrapper";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/sign-in" || pathname === "/register";

  if (isAuthPage) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main className="min-h-screen flex items-center justify-center bg-white">
          {children}
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col gap-20 items-center">
          <nav className="w-full flex justify-center border-b h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <AuthWrapper />
              </div>
              <ThemeSwitcher />
            </div>
          </nav>
          <div className="flex flex-col gap-20 max-w-5xl p-5 w-full">
            {children}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
