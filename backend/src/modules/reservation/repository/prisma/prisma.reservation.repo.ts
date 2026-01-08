import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import ReservationEntity, {
  ReservationStatus,
} from '../../entities/reservation.entity';
import ReservationRepository from '../reservation.repo';

@Injectable()
export default class PrismaReservationRepository
  implements ReservationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(data: any): ReservationEntity {
    return new ReservationEntity({
      id: data.id,
      serviceId: data.serviceId,
      providerId: data.providerId,
      clientId: data.clientId,
      price: data.price,
      status: data.status as ReservationStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      service: data.service,
    });
  }

  async create(
    reservation: ReservationEntity,
    tx?: any,
  ): Promise<ReservationEntity | null> {
    const prisma = tx ?? this.prisma;
    const result = await prisma.reservation.create({
      data: {
        id: reservation.id,
        serviceId: reservation.serviceId,
        providerId: reservation.providerId,
        clientId: reservation.clientId,
        price: reservation.price,
        status: 'confirmed',
        createdAt: reservation.createdAt,
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    const result = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByClientId(clientId: string): Promise<ReservationEntity[]> {
    const results = await this.prisma.reservation.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    });
    const reservations = results.map((r) => this.mapToEntity(r));
    return reservations;
  }

  async findByServiceId(
    serviceId: string,
    clientId: string,
  ): Promise<ReservationEntity[]> {
    const results = await this.prisma.reservation.findMany({
      where: { serviceId: serviceId, clientId: clientId, status: 'confirmed' },
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    });
    const reservations = results.map((r) => this.mapToEntity(r));
    return reservations;
  }

  async cancel(id: string, tx?: any): Promise<boolean> {
    const prisma = tx ?? this.prisma;
    const result = await prisma.reservation.update({
      where: { id },
      data: {
        status: 'canceled',
        updatedAt: new Date(),
      },
    });
    return result ? true : false;
  }
}
