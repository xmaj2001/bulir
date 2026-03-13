import { ServiceEntity } from "../entities/service.entity";

export abstract class ServiceRepository {
  abstract findById(id: string): Promise<ServiceEntity | null>;
  abstract findByProviderId(providerId: string): Promise<ServiceEntity[]>;
  abstract findAllActive(): Promise<ServiceEntity[]>;
  abstract save(service: ServiceEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
