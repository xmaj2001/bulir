import { Injectable } from '@nestjs/common';
import ServiceRepository from './service.repo';
import ServiceEntity from '../entities/service.entity';

@Injectable()
export default class FakeServiceRepository implements ServiceRepository {
  private services: ServiceEntity[] = [
    new ServiceEntity(
      'Corte de Cabelo',
      'Corte de cabelo profissional',
      500,
      '1',
      '1',
    ),
    new ServiceEntity(
      'Manicure',
      'Serviço de manicure completo',
      14000,
      '2',
      '2',
    ),
    new ServiceEntity(
      'Massagem Relaxante',
      'Massagem para relaxamento muscular',
      8000,
      '3',
      '3',
    ),
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

  async findAll(): Promise<ServiceEntity[]> {
    await Promise.resolve();
    return this.services;
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
