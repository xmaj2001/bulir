"use server";
import { cookies } from "next/headers";
import type { MeResponse } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getMeServer(): Promise<MeResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    console.log("Access Token: ", accessToken);
    if (!accessToken) return null;

    const res = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    return res.json() as Promise<MeResponse>;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}
