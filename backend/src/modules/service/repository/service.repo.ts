import ServiceEntity from '../entities/service.entity';

export default abstract class ServiceRepository {
  abstract create(service: ServiceEntity): Promise<ServiceEntity>;
  abstract findById(id: string): Promise<ServiceEntity | null>;
  abstract findPaginated(page: number, items: number): Promise<ServiceEntity[]>;
  abstract findByProviderId(
    providerId: string,
    page: number,
    items: number,
  ): Promise<ServiceEntity[]>;
  abstract update(service: ServiceEntity): Promise<ServiceEntity>;
  abstract delete(id: string): Promise<void>;
}
