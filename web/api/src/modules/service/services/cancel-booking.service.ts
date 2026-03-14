import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";
import { BookingStatus } from "../entities/booking.entity";

@Injectable()
export class CancelBookingService {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(clientId: string, bookingId: string, reason?: string) {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Reserva não encontrada");
    }

    if (booking.clientId !== clientId) {
      throw new ForbiddenException(
        "Não tens permissão para cancelar esta reserva",
      );
    }

    if (!booking.isCancellable()) {
      throw new BadRequestException(
        `Não é possível cancelar uma reserva com status ${booking.status}`,
      );
    }

    const previousStatus = booking.status;

    // Se estiver confirmada, o dinheiro já saiu do cliente. Reembolsar.
    if (previousStatus === BookingStatus.CONFIRMED) {
      await this.bookingRepo.processRefund({
        bookingId: booking.id,
        clientId: booking.clientId,
        totalPrice: booking.totalPrice,
      });
    }

    booking.cancel(reason);
    await this.bookingRepo.save(booking);

    return booking.publicData();
  }
}
