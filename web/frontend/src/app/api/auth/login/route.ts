// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    const isEmail = identifier.includes("@");
    const endpoint = isEmail ? "/auth/sign-in/email" : "/auth/sign-in/nif";
    const credentials = isEmail
      ? { email: identifier, password }
      : { nif: identifier, password };

    // Chama a API directamente — precisamos dos headers raw da resposta
    const apiRes = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const data = await apiRes.json();

    if (!data.success || !data.data?.access_token) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const { accessToken, user } = data.data;

    const response = NextResponse.json({ success: true, user });

    // 1. Seta o access_token (gerido pelo Next.js)
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // 2. Propaga o refresh_token que o NestJS setou
    // Agora conseguimos ler porque estamos no servidor Node.js
    // e o fetch expõe Set-Cookie em ambiente server
    const setCookieHeader = apiRes.headers.get("set-cookie");
    if (setCookieHeader) {
      // Append para não sobrescrever o access_token que acabámos de setar
      response.headers.append("Set-Cookie", setCookieHeader);
    }

    return response;
  } catch (err) {
    console.error("[login route]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
