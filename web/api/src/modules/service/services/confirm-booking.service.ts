import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";
import { BookingStatus } from "../entities/booking.entity";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { BookingCompletedEvent } from "../events/booking-completed.event";

@Injectable()
export class ConfirmBookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(providerId: string, bookingId: string) {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Reserva não encontrada");
    }

    // Apenas o provider do serviço pode confirmar
    if (booking.service?.providerId !== providerId) {
      throw new ForbiddenException(
        "Não tens permissão para confirmar esta reserva",
      );
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Apenas reservas PENDENTES podem ser confirmadas. Status atual: ${booking.status}`,
      );
    }

    await this.bookingRepo.save(booking);

    this.eventBus.publish([
      new BookingCompletedEvent({
        bookingId: booking.id,
        clientId: booking.clientId,
        providerId: booking.service?.providerId,
        totalPrice: booking.totalPrice,
      }),
    ]);

    return booking.publicData();
  }
}
