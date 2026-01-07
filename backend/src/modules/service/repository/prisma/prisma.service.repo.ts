import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import ServiceEntity from '../../entities/service.entity';
import ServiceRepository from '../service.repo';

@Injectable()
export default class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    });
    return new ServiceEntity(
      result.name,
      result.description,
      result.price,
      result.providerId,
      result.id,
    );
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const prismaService = await this.prisma.service.findUnique({
      where: { id },
    });

    const serviceEntity = prismaService
      ? new ServiceEntity(
          prismaService.name,
          prismaService.description,
          prismaService.price,
          prismaService.providerId,
          prismaService.id,
        )
      : null;

    return serviceEntity;
  }

  async findPaginated(page: number, items: number): Promise<ServiceEntity[]> {
    const skip = (page - 1) * items;
    const prismaServices = await this.prisma.service.findMany({
      skip,
      take: items,
      orderBy: { createdAt: 'desc' },
    });
    const serviceEntities = prismaServices.map(
      (s) =>
        new ServiceEntity(s.name, s.description, s.price, s.providerId, s.id),
    );
    return serviceEntities;
  }

  async findByProviderId(providerId: string): Promise<ServiceEntity[]> {
    const prismaServices = await this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
    const serviceEntities = prismaServices.map(
      (s) =>
        new ServiceEntity(s.name, s.description, s.price, s.providerId, s.id),
    );
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
    });
    return new ServiceEntity(
      prismaService.name,
      prismaService.description,
      prismaService.price,
      prismaService.providerId,
      prismaService.id,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: { id },
    });
  }
}
