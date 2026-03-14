// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/profile",
  "/services",
  "/bookings",
];
const publicRoutes = ["/auth/login", "/auth/register", "/"];

export default function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const pathname = req.nextUrl.pathname;

  const isLoggedIn = !!(accessToken || refreshToken);

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (publicRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
