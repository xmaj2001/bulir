"use client";

import { useState } from "react";
import type { User } from "@/types/user";
import { AuthService } from "@/http/auth/auth.service";
import AuthContext from "../../context/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isAuthenticated = !!user && !!accessToken;

  async function login(email: string, password: string) {
    const data = await AuthService.login(email, password);
    if (data) {
      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      console.log("Logged in user:", data.accessToken, data.user);
      return true;
    }
    return false;
  }

  async function logout() {
    await AuthService.logout();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  }

  console.log("AuthProvider render:", { user, accessToken, isAuthenticated });
  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
