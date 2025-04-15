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

    const { data: { user }, error } = await supabase.auth.getUser();

    // Si no hay sesión, redirige al login
    if (
      (request.nextUrl.pathname.startsWith("/protected") ||
        request.nextUrl.pathname.startsWith("/dashboard")) &&
      error
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Si hay sesión y está en la raíz, redirige según el rol
    if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/sign-in" && user) {
      const roleId = user?.user_metadata?.roleId;

      console.log(roleId) 

      if (roleId === 1) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }

      if (roleId === 2) {
        return NextResponse.redirect(new URL("/dashboard/comprador", request.url));
      }

      if (roleId === 3) {
        return NextResponse.redirect(new URL("/dashboard/aprobadorjefe", request.url));
      }

      if (roleId === 4) {
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }

      if (roleId === 5) {
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }

      if (roleId === 6) {
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }

      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // 🔒 RESTRICCIÓN para compradores
    if (user) {
      const roleId = user.user_metadata?.roleId;

      if (
        roleId === 1 &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/admin")
      ) {
        // comprador intenta acceder a ruta no permitida
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
      if (
        roleId === 2 &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/comprador")
      ) {
        // comprador intenta acceder a ruta no permitida
        return NextResponse.redirect(new URL("/dashboard/comprador", request.url));
      }
      if(
        roleId === 3 &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/aprobadorjefe")
      ) {
        // comprador intenta acceder a ruta no permitida
        return NextResponse.redirect(new URL("/dashboard/aprobadorjefe", request.url));
      }

      if(
        roleId === 4 &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/financiero")
      ) {
        // comprador intenta acceder a ruta no permitida
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }
      if(
        roleId === 5 &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/financiero")
      ) {
        // comprador intenta acceder a ruta no permitida
        return NextResponse.redirect(new URL("/dashboard/financiero", request.url));
      }
      if(
        roleId === 6 &&
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !request.nextUrl.pathname.startsWith("/dashboard/financiero")
      ) {
        // comprador intenta acceder a ruta no permitida
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

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
