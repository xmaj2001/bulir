import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";
import { BookingStatus } from "../entities/booking.entity";
import { BookingCancelledEvent } from "../events/booking-cancelled.event";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";

@Injectable()
export class CancelBookingService {
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(requesterId: string, bookingId: string, reason?: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundException("Reserva não encontrada");

    const isClient = booking.clientId === requesterId;
    const isProvider = booking.service?.providerId === requesterId;

    if (!isClient && !isProvider) {
      throw new ForbiddenException(
        "Não tens permissão para cancelar esta reserva",
      );
    }

    if (isClient && booking.status !== BookingStatus.PENDING) {
      throw new ForbiddenException(
        "Só podes cancelar reservas pendentes. Contacta o prestador para cancelar.",
      );
    }

    if (isProvider && !booking.isCancellable()) {
      throw new BadRequestException(
        `Não é possível cancelar uma reserva com status ${booking.status}`,
      );
    }

    const previousStatus = booking.status;
    booking.cancel(reason);
    await this.bookingRepo.save(booking);

    this.eventBus.publish([new BookingCancelledEvent(booking, previousStatus)]);

    return booking.publicData();
  }
}
