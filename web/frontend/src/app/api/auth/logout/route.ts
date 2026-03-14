// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("access_token")?.value;
    const allCookies = req.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: allCookies,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  } catch {
    // Mesmo que a API falhe, limpa os cookies locais
  }

  const response = NextResponse.json({ success: true });

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
