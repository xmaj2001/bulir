import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { ServiceRepository } from "../repository/service.repo";
import { ServiceEntity } from "../entities/service.entity";

@Injectable()
export class PrismaServiceRepository extends ServiceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const data = await this.prisma.service.findUnique({ where: { id } });
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async findByProviderId(providerId: string): Promise<ServiceEntity[]> {
    const data = await this.prisma.service.findMany({ where: { providerId } });
    return data.map((item) => this.mapToEntity(item));
  }

  async findAllActive(): Promise<ServiceEntity[]> {
    const data = await this.prisma.service.findMany({
      where: { isActive: true },
    });
    return data.map((item) => this.mapToEntity(item));
  }

  async save(service: ServiceEntity): Promise<void> {
    const data = {
      id: service.id,
      providerId: service.providerId,
      imageUrl: service.imageUrl,
      name: service.name,
      description: service.description,
      price: service.price,
      isActive: service.isActive,
      updatedAt: service.updatedAt,
    };

    await this.prisma.service.upsert({
      where: { id: service.id },
      update: data,
      create: { ...data, createdAt: service.createdAt },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
  }

  private mapToEntity(data: any): ServiceEntity {
    return new ServiceEntity({
      id: data.id,
      providerId: data.providerId,
      imageUrl: data.imageUrl,
      name: data.name,
      description: data.description,
      price: data.price,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
