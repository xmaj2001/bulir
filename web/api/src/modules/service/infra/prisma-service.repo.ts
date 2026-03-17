import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { ServiceRepository } from "../repository/service.repo";
import { ServiceEntity } from "../entities/service.entity";
import { UserEntity } from "@modules/user/entities/user.entity";

@Injectable()
export class PrismaServiceRepository extends ServiceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const data = await this.prisma.service.findUnique({
      where: { id },
      include: { provider: true },
    });
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async findByProviderId(providerId: string): Promise<ServiceEntity[]> {
    const data = await this.prisma.service.findMany({
      where: { providerId },
      include: { provider: true },
    });
    return data.map((item) => this.mapToEntity(item));
  }

  async findAllActive(): Promise<ServiceEntity[]> {
    const data = await this.prisma.service.findMany({
      where: { isActive: true },
      include: { provider: true },
    });
    return data.map((item) => this.mapToEntity(item));
  }

  async search(filters: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    page: number;
    limit: number;
  }): Promise<{ data: ServiceEntity[]; total: number }> {
    const { query, minPrice, maxPrice, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: data.map((item) => this.mapToEntity(item)),
      total,
    };
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
    let provider: UserEntity | undefined = undefined;
    if (data.provider) {
      provider = new UserEntity({
        id: data.provider.id,
        name: data.provider.name,
        email: data.provider.email,
        avatarUrl: data.provider.avatarUrl,
        role: data.provider.role,
        nif: data.provider.nif,
        createdAt: data.provider.createdAt,
        updatedAt: data.provider.updatedAt,
      });
    }
    return new ServiceEntity({
      id: data.id,
      providerId: data.providerId,
      provider: provider,
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
