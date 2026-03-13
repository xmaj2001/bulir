import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PROVIDER_ONLY = ["/dashboard/services", "/dashboard/services/new"];
const ADMIN_ONLY = ["/admin"];

function isMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

export default auth((req) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nextUrl, auth: session } = req as NextRequest & { auth: any };
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!session;
  const role = session?.role as string | undefined;

  if (isLoggedIn && isMatch(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isMatch(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname); // guarda para onde ia
    return NextResponse.redirect(loginUrl);
  }

  if (session?.error === "RefreshAccessTokenError") {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("error", "SessionExpired");
    return NextResponse.redirect(loginUrl);
  }

  if (isMatch(pathname, PROVIDER_ONLY) && role !== "PROVIDER") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }
  if (isMatch(pathname, ADMIN_ONLY) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
