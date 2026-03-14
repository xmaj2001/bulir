"use client";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { setUser, clearUser, user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const login = async (identifier: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Credenciais inválidas");
    }

    const { user } = await res.json();

    // Guarda dados do user no Zustand (em memória, seguro)
    setUser(user);
    router.push("/dashboard");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/auth/login");
  };

  return { login, logout, user, isAuthenticated };
}
