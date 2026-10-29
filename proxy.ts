import {createServerClient} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {headers: request.headers},
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({name, value}) =>
                    request.cookies.set(name, value),
                );
                response = NextResponse.next({request});
                cookiesToSet.forEach(({name, value, options}) =>
                    response.cookies.set(name, value, options),
                );
            },
        },
    });

    // Fetch the current session details
    const {
        data: {user},
    } = await supabase.auth.getUser();

    const nextUrl = request.nextUrl;

    function redirectTo(path: string | URL) {
        const redirectResponse = NextResponse.redirect(new URL(path, request.url));
        response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c));
        return redirectResponse;
    }

    if (nextUrl.pathname.startsWith("/control-panel")) {
        if (!user) {
            return redirectTo("/admin");
        }

        const role = user.app_metadata?.role;

        // if (role !== "admin" && role !== "staff") {
        //     return redirectTo("/admin");
        // }
    }

    if (nextUrl.pathname === "/admin" && user) {
        const role = user.app_metadata?.role;

        if (role === "admin" || role === "staff") {
            return redirectTo("/control-panel");
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
