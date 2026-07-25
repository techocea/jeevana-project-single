import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
  });

  // Fetch the current session details
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextUrl = request.nextUrl;

  if (nextUrl.pathname.startsWith("/my-dashboard")) {
    if (!user) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("mode", "login");
      return NextResponse.redirect(loginUrl);
    }
  }

  if (nextUrl.pathname.startsWith("/control-panel")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const role = user.user_metadata?.role;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }
  return response;
}

export const config = {
  matcher: [
    "/my-dashboard/:path*",
    "/control-panel/:path*",
    "/onboarding/:path*",
    "/auth",
    "/admin",
  ],
};
