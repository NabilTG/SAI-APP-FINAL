import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    let user = null;

    try {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.warn("Usuario no autenticado, puede ignorarse si es intencional:", error.message);
      } else {
        user = currentUser;
      }
    } catch (err) {
      console.error("Excepción al intentar obtener usuario:", err);
    }

    // Si no hay sesión, redirige al login
    if (
      (request.nextUrl.pathname.startsWith("/protected") ||
        request.nextUrl.pathname.startsWith("/dashboard")) &&
      !user
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Si hay sesión y está en la raíz, redirige según el rol
    if (
      (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/sign-in") &&
      user
    ) {
      const roleId = user?.user_metadata?.roleId;

      console.log(roleId);

      if (roleId === 1) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }

      if (roleId === 2) {
        return NextResponse.redirect(new URL("/dashboard/comprador", request.url));
      }

      if (roleId === 3) {
        return NextResponse.redirect(new URL("/dashboard/aprobadorjefe", request.url));
      }

      if ([4, 5, 6].includes(roleId)) {
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }

      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // 🔒 RESTRICCIÓN para rutas según rol
    if (user) {
      const roleId = user.user_metadata?.roleId;
      const path = request.nextUrl.pathname;

      if (
        roleId === 1 &&
        path.startsWith("/dashboard") &&
        !path.startsWith("/dashboard/admin")
      ) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }

      if (
        roleId === 2 &&
        path.startsWith("/dashboard") &&
        !path.startsWith("/dashboard/comprador")
      ) {
        return NextResponse.redirect(new URL("/dashboard/comprador", request.url));
      }

      if (
        roleId === 3 &&
        path.startsWith("/dashboard") &&
        !path.startsWith("/dashboard/aprobadorjefe")
      ) {
        return NextResponse.redirect(new URL("/dashboard/aprobadorjefe", request.url));
      }

      if (
        [4, 5, 6].includes(roleId) &&
        path.startsWith("/dashboard") &&
        !path.startsWith("/dashboard/financiero")
      ) {
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
