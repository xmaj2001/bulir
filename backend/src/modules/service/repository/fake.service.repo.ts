import { Injectable } from '@nestjs/common';
import ServiceRepository from './service.repo';
import ServiceEntity from '../entities/service.entity';

@Injectable()
export default class FakeServiceRepository implements ServiceRepository {
  private services: ServiceEntity[] = [
    new ServiceEntity({
      id: '1',
      name: 'Corte de Cabelo',
      description: 'Corte de cabelo profissional para todas as idades',
      price: 5000,
      providerId: '2',
    }),
    new ServiceEntity({
      id: '2',
      name: 'Manicure',
      description: 'Serviço de manicure completo',
      price: 14000,
      providerId: '2',
    }),
    new ServiceEntity({
      id: '3',
      name: 'Massagem Relaxante',
      description: 'Massagem para relaxamento muscular',
      price: 8000,
      providerId: '3',
    }),
  ];

  async create(service: ServiceEntity): Promise<ServiceEntity> {
    await Promise.resolve();
    this.services.push(service);
    return service;
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    await Promise.resolve();
    return this.services.find((s) => s.id === id) ?? null;
  }

  async findPaginated(page: number, items: number): Promise<ServiceEntity[]> {
    await Promise.resolve();
    const startIndex = (page - 1) * items;
    return this.services.slice(startIndex, startIndex + items);
  }

  async findByProviderId(providerId: string): Promise<ServiceEntity[]> {
    await Promise.resolve();
    return this.services.filter((s) => s.providerId === providerId);
  }

  async update(service: ServiceEntity): Promise<ServiceEntity> {
    await Promise.resolve();
    const index = this.services.findIndex((s) => s.id === service.id);
    if (index === -1) {
      throw new Error('Serviço não encontrado');
    }
    this.services[index] = service;
    return service;
  }

  async delete(id: string): Promise<void> {
    await Promise.resolve();
    this.services = this.services.filter((s) => s.id !== id);
  }
}
