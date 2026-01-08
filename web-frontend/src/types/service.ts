export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  provider?: string;
  rating?: number;
  reviews?: number;
  duration?: string;
  location?: string;
  image?: string;
}
