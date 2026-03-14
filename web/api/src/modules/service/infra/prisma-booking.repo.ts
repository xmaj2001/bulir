import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { BookingRepository } from "../repository/booking.repo";
import { BookingEntity, BookingStatus } from "../entities/booking.entity";
import { ProviderProps, ServiceEntity } from "../entities/service.entity";
import { UserEntity } from "@modules/user/entities/user.entity";

@Injectable()
export class PrismaBookingRepository extends BookingRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<BookingEntity | null> {
    const data = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: { include: { provider: true } } },
    });
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async findByClientId(clientId: string): Promise<BookingEntity[]> {
    const data = await this.prisma.booking.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: { service: { include: { provider: true } } },
    });
    return data.map((item) => this.mapToEntity(item));
  }

  async findByServiceId(serviceId: string): Promise<BookingEntity[]> {
    const data = await this.prisma.booking.findMany({
      where: { serviceId },
      orderBy: { createdAt: "desc" },
      include: { service: { include: { provider: true } } },
    });
    return data.map((item) => this.mapToEntity(item));
  }

  async findByStatus(status: BookingStatus): Promise<BookingEntity[]> {
    const data = await this.prisma.booking.findMany({
      where: { status: status as any },
      orderBy: { createdAt: "desc" },
      include: { service: { include: { provider: true } } },
    });
    return data.map((item) => this.mapToEntity(item));
  }

  async save(booking: BookingEntity): Promise<void> {
    const data = {
      id: booking.id,
      clientId: booking.clientId,
      serviceId: booking.serviceId,
      status: booking.status as any,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      scheduledAt: booking.scheduledAt,
      confirmedAt: booking.confirmedAt,
      completedAt: booking.completedAt,
      cancelledAt: booking.cancelledAt,
      cancelReason: booking.cancelReason,
      updatedAt: booking.updatedAt,
    };

    await this.prisma.booking.upsert({
      where: { id: booking.id },
      update: data,
      create: { ...data, createdAt: booking.createdAt },
    });
  }

  async processPayment(params: {
    bookingId: string;
    clientId: string;
    totalPrice: number;
  }): Promise<void> {
    const { bookingId, clientId, totalPrice } = params;

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: clientId } });
      if (!user) throw new Error("Utilizador não encontrado");

      const balance = Number(user.balance);
      if (balance < totalPrice) {
        throw new Error("Saldo insuficiente");
      }

      await tx.user.update({
        where: { id: clientId },
        data: { balance: balance - totalPrice },
      });

      await tx.walletTransaction.create({
        data: {
          userId: clientId,
          bookingId: bookingId,
          type: "DEBIT",
          reason: "BOOKING_PAYMENT",
          amount: totalPrice,
          balanceBefore: balance,
          balanceAfter: balance - totalPrice,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });
    });
  }

  async processPayout(params: {
    bookingId: string;
    providerId: string;
    totalPrice: number;
  }): Promise<void> {
    const { bookingId, providerId, totalPrice } = params;

    await this.prisma.$transaction(async (tx) => {
      const provider = await tx.user.findUnique({ where: { id: providerId } });
      if (!provider) throw new Error("Provider não encontrado");

      const balanceBefore = Number(provider.balance);

      await tx.user.update({
        where: { id: providerId },
        data: { balance: balanceBefore + totalPrice },
      });
      await tx.walletTransaction.create({
        data: {
          userId: providerId,
          bookingId: bookingId,
          type: "CREDIT",
          reason: "BOOKING_RECEIPT",
          amount: totalPrice,
          balanceBefore: balanceBefore,
          balanceAfter: balanceBefore + totalPrice,
        },
      });
    });
  }

  async processRefund(params: {
    bookingId: string;
    clientId: string;
    totalPrice: number;
  }): Promise<void> {
    const { bookingId, clientId, totalPrice } = params;

    await this.prisma.$transaction(async (tx) => {
      const client = await tx.user.findUnique({ where: { id: clientId } });
      if (!client) throw new Error("Cliente não encontrado");

      const balanceBefore = Number(client.balance);

      // 1. Devolver saldo ao cliente
      await tx.user.update({
        where: { id: clientId },
        data: { balance: balanceBefore + totalPrice },
      });

      // 2. Registar transação
      await tx.walletTransaction.create({
        data: {
          userId: clientId,
          bookingId: bookingId,
          type: "CREDIT",
          reason: "BOOKING_REFUND",
          amount: totalPrice,
          balanceBefore: balanceBefore,
          balanceAfter: balanceBefore + totalPrice,
        },
      });
    });
  }

  private mapToEntity(data: any): BookingEntity {
    let service: ServiceEntity | undefined;
    let provider: ProviderProps | undefined;

    if (data.service.provider) {
      provider = {
        id: data.service.provider.id,
        name: data.service.provider.name,
        email: data.service.provider.email,
        avatarUrl: data.service.provider.avatarUrl,
      };
    }

    if (data.service) {
      service = new ServiceEntity({
        id: data.service.id,
        providerId: data.service.providerId,
        provider: provider,
        name: data.service.name,
        description: data.service.description,
        price: Number(data.service.price),
        isActive: data.service.isActive,
        createdAt: data.service.createdAt,
        updatedAt: data.service.updatedAt,
      });
    }

    return new BookingEntity({
      id: data.id,
      clientId: data.clientId,
      serviceId: data.serviceId,
      service: service,
      status: data.status as BookingStatus,
      totalPrice: Number(data.totalPrice),
      notes: data.notes,
      scheduledAt: data.scheduledAt,
      confirmedAt: data.confirmedAt,
      completedAt: data.completedAt,
      cancelledAt: data.cancelledAt,
      cancelReason: data.cancelReason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
