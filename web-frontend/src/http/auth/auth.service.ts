import { API } from "../config";

export const AuthService = {
  async login(email: string, password: string) {
    const resp = await fetch(`${API.BASE_URL}/auth/login`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error("Erro ao fazer login:", dataJson);
      return null;
    }
    return {
      accessToken: dataJson.accessToken,
      user: dataJson.user,
    };
  },
  
  async refresh() {
    const res = await fetch(`${API.BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("No session");
    return res.json();
  },

  async logout() {
    const resp = await fetch(`${API.BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      console.error("Erro ao fazer logout");
      return false;
    }
    return true;
  },
};
