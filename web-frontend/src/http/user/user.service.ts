import { User } from "@/types/user";
import { API } from "../config";

export const UserService = {
  async getById(accessToken: string): Promise<User | null> {
    const resp = await fetch(`${API.BASE_URL}/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error(`Erro ao buscar usuário:`, dataJson);
      return null;
    }
    return dataJson;
  },

  async updateBalance(
    accessToken: string,
    amount: number
  ): Promise<User | null> {
    const resp = await fetch(`${API.BASE_URL}/users/balance`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount }),
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error(`Erro ao atualizar saldo do usuário:`, dataJson);
      return null;
    }
    return dataJson;
  },
};
