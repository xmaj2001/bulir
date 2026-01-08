import { Reservation } from "./reservation";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  image?: string;
  reservations: Reservation[];
}
