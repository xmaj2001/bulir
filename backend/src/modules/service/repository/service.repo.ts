import ServiceEntity from '../entities/service.entity';

export default abstract class ServiceRepository {
  abstract create(service: ServiceEntity): Promise<ServiceEntity>;
  abstract findById(id: string): Promise<ServiceEntity | null>;
  abstract findAll(): Promise<ServiceEntity[]>;
  abstract findByProviderId(providerId: string): Promise<ServiceEntity[]>;
  abstract update(service: ServiceEntity): Promise<ServiceEntity>;
  abstract delete(id: string): Promise<void>;
}
