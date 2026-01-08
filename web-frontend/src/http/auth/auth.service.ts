import { API } from "../config";

interface RegisterData {
  name: string;
  email: string;
  nif: string;
  password: string;
  role: "client" | "provider";
}

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

  async register(data: RegisterData) {
    const resp = await fetch(`${API.BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error("Erro ao registrar:", dataJson);
      return null;
    }
    return dataJson;
  },

  async activeAccount(
    accessToken: string
  ): Promise<{ message: string } | null> {
    const resp = await fetch(`${API.BASE_URL}/auth/activate-account`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!resp.ok) {
      const dataJson = await resp.json();
      console.error(`Erro ao ativar conta:`, dataJson);
      return null;
    }

    return await resp.json();
  },
};
