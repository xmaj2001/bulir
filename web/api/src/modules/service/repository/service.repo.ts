import { ServiceEntity } from "../entities/service.entity";

export abstract class ServiceRepository {
  abstract findById(id: string): Promise<ServiceEntity | null>;
  abstract findByProviderId(providerId: string): Promise<ServiceEntity[]>;
  abstract findAllActive(): Promise<ServiceEntity[]>;
  abstract search(filters: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    page: number;
    limit: number;
  }): Promise<{ data: ServiceEntity[]; total: number }>;
  abstract save(service: ServiceEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
