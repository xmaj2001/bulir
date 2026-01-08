import { API } from "../config";
import { Service as ServiceModel } from "@/types/service";

interface ServiceCreate {
  name: string;
  description: string;
  price: number;
}

export const Service = {
  async create(
    serviceData: ServiceCreate,
    accessToken: string
  ): Promise<ServiceModel | null> {
    const resp = await fetch(`${API.BASE_URL}/services`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(serviceData),
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error("Erro ao criar serviço:", dataJson);
      return null;
    }
    return dataJson as ServiceModel;
  },

  async getAll(accessToken: string): Promise<ServiceModel[]> {
    const resp = await fetch(`${API.BASE_URL}/services`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error("Erro ao buscar serviços:", dataJson);
      return [];
    }
    return dataJson as ServiceModel[];
  },

  async getById(id: string, accessToken: string): Promise<ServiceModel | null> {
    const resp = await fetch(`${API.BASE_URL}/services/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const dataJson = await resp.json();
    if (!resp.ok) {
      console.error(`Erro ao buscar serviço de id ${id}:`, dataJson);
      return null;
    }
    return dataJson;
  },
  
};
