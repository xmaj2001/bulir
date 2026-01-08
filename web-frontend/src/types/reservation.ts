import { Service } from "./service";

export interface Reservation {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  service: Service
}