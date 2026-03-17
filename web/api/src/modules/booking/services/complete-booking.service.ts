// complete-booking.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { BookingCompletedEvent } from "../events/booking-completed.event";
import { BookingStatus } from "../entities/booking.entity";

@Injectable()
export class CompleteBookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(providerId: string, bookingId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundException("Reserva não encontrada");

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        "Só reservas confirmadas podem ser concluídas",
      );
    }

    if (!booking.service) {
      throw new BadRequestException("Reserva não tem serviço");
    }

    if (booking.service.providerId !== providerId) {
      throw new ForbiddenException(
        "Só o prestador do serviço pode marcar a reserva como concluída",
      );
    }

    booking.complete();
    await this.bookingRepo.save(booking);
    this.eventBus.publish([
      new BookingCompletedEvent({
        bookingId: booking.id,
        clientId: booking.clientId,
        providerId: booking.service.providerId,
        totalPrice: booking.totalPrice,
      }),
    ]);

    return booking.publicData();
  }
}
