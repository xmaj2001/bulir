// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    // Pega todos os cookies da req e repassa ao NestJS
    const allCookies = req.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const apiRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: allCookies,
      },
    });

    if (!apiRes.ok) {
      const response = NextResponse.json(
        { error: "Sessão expirada" },
        { status: 401 },
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    const data = await apiRes.json();
    const newAccessToken = data?.data?.access_token;

    const response = NextResponse.json({ success: true });

    // Novo access_token
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    const setCookieHeader = apiRes.headers.get("set-cookie");
    if (setCookieHeader) {
      response.headers.append("Set-Cookie", setCookieHeader);
    }

    console.log("Refresh Token Route");
    return response;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
