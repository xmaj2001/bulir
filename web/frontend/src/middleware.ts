import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth;

  const requestHeaders = new Headers(req.headers);

  if (auth?.access_token) {
    requestHeaders.set("Authorization", `Bearer ${auth.access_token}`);
  }

  const isProtectedRoute = [
    "/dashboard",
    "/settings",
    "/profile",
    "/services",
    "/bookings",
    "/orders",
  ].some((route) => nextUrl.pathname.startsWith(route));

  const isPublicRoute = ["/auth/login", "/auth/register", "/"].includes(
    nextUrl.pathname,
  );

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isPublicRoute && isLoggedIn && nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
