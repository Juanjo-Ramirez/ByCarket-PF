import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const authToken = request.cookies.get("authToken")?.value;

  const isLandingPage = request.nextUrl.pathname === "/";
  const isDashboardPath = request.nextUrl.pathname.startsWith("/dashboard");
  const isAdminPath = request.nextUrl.pathname.startsWith("/dashboard/admin");

  if (isLandingPage && (authToken || token)) {
    const dashboardUrl = new URL("/home", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isDashboardPath && !authToken && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath) {
    let userRole = null;

    if (authToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(authToken.split(".")[1], "base64").toString()
        );
        userRole = payload.role;
      } catch (error) {
        console.error("Error decodificando el token JWT:", error);
      }
    } else if (token) {
      userRole = token.role || "user";
    }

    if (userRole !== "admin") {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
