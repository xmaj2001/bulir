import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/services")) {
      if (token.role == "provider") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
     if (pathname.startsWith("/reservations")) {
      if (token.role == "provider") {
        return NextResponse.redirect(new URL("/history", req.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (token.role == "client") {
        return NextResponse.redirect(new URL("/services", req.url));
      }
    }
    

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/services/:path*",
    "/dashboard/:path*",
    "/book/:path*",
    "/reservations/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
