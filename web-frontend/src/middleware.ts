import { NextResponse } from "next/server";

export default async function middleware(req: Request) {
  const url = new URL(req.url);

//   const accessToken = req.cookies.get("accessToken")?.value;

//   const isAuthPath = url.pathname.startsWith("/auth");

//   if (!accessToken && !isAuthPath) {
//     return Response.redirect(new URL("/auth/login", req.url), 307);
//   }

//   if (accessToken && isAuthPath) {
//     return Response.redirect(new URL("/", req.url), 307);
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
