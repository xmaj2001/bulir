import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import ReservationEntity, {
  ReservationStatus,
} from '../../entities/reservation.entity';
import ReservationRepository from '../reservation.repo';

@Injectable()
export default class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

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
        price: 0,
        status: 'PENDING',
        createdAt: reservation.createdAt,
        updatedAt: new Date(),
      },
    });
    return new ReservationEntity({
      id: result.id,
      serviceId: result.serviceId,
      providerId: result.providerId,
      clientId: result.clientId,
      price: result.price,
      status: result.status as ReservationStatus,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    const result = await this.prisma.reservation.findUnique({
      where: { id },
    });
    return result
      ? new ReservationEntity({
          id: result.id,
          serviceId: result.serviceId,
          providerId: result.providerId,
          clientId: result.clientId,
          price: result.price,
          status: result.status as ReservationStatus,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        })
      : null;
  }

  async findByClientId(clientId: string): Promise<ReservationEntity[]> {
    const results = await this.prisma.reservation.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
    const reservations = results.map(
      (r) =>
        new ReservationEntity({
          id: r.id,
          serviceId: r.serviceId,
          providerId: r.providerId,
          clientId: r.clientId,
          price: r.price,
          status: r.status as ReservationStatus,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
    );
    return reservations;
  }

  async cancel(id: string): Promise<void> {
    await this.prisma.reservation.update({
      where: { id },
      data: {
        status: 'CANCELED',
        updatedAt: new Date(),
      },
    });
  }
}
