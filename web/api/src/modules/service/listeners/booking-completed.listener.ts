import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { BookingCompletedEvent } from "../events/booking-completed.event";
import { BookingRepository } from "../repository/booking.repo";

@Injectable()
export class BookingCompletedListener {
  private readonly logger = new Logger(BookingCompletedListener.name);

  constructor(private readonly bookingRepo: BookingRepository) {}

  @OnEvent("BOOKING.COMPLETED")
  async handle(event: BookingCompletedEvent) {
    const { bookingId, providerId, totalPrice } = event;
    this.logger.log(`Creditando provider para booking ${bookingId}`);

    try {
      await this.bookingRepo.processPayout({
        bookingId,
        providerId,
        totalPrice,
      });

      this.logger.log(
        `Crédito realizado com sucesso para provider ${providerId} (Booking: ${bookingId})`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao creditar provider para booking ${bookingId}: ${error.message}`,
      );
    }
  }
}
