import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import ServiceEntity from '../../entities/service.entity';
import ServiceRepository from '../service.repo';

@Injectable()
export default class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(entity: any): ServiceEntity {
    return new ServiceEntity({
      name: entity.name,
      description: entity.description,
      price: entity.price,
      providerId: entity.providerId,
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      reservations: entity.reservations,
    });
  }

  async create(service: ServiceEntity): Promise<ServiceEntity> {
    const result = await this.prisma.service.create({
      data: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        providerId: service.providerId,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      },
      include: { reservations: true },
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const prismaService = await this.prisma.service.findUnique({
      where: { id },
      include: { reservations: true },
    });

    const serviceEntity = prismaService
      ? this.mapToEntity(prismaService)
      : null;

    return serviceEntity;
  }

  async findPaginated(page: number, items: number): Promise<ServiceEntity[]> {
    const skip = (page - 1) * items;
    const prismaServices = await this.prisma.service.findMany({
      skip,
      take: items,
      orderBy: { createdAt: 'desc' },
      include: { reservations: true },
    });
    const serviceEntities = prismaServices.map((s) => this.mapToEntity(s));
    return serviceEntities;
  }

  async findByProviderId(providerId: string): Promise<ServiceEntity[]> {
    const prismaServices = await this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      include: { reservations: true },
    });
    const serviceEntities = prismaServices.map((s) => this.mapToEntity(s));
    return serviceEntities;
  }

  async update(service: ServiceEntity): Promise<ServiceEntity> {
    const prismaService = await this.prisma.service.update({
      where: { id: service.id },
      data: {
        name: service.name,
        description: service.description,
        price: service.price,
        updatedAt: new Date(),
      },
      include: { reservations: true },
    });
    return this.mapToEntity(prismaService);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }
}
