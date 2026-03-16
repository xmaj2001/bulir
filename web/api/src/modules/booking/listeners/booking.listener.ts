import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { BookingStatus } from "../entities/booking.entity";
import { BookingCreatedEvent } from "../events/booking-created.event";
import { BookingCompletedEvent } from "../events/booking-completed.event";
import { BookingCancelledEvent } from "../events/booking-cancelled.event";

@Injectable()
export class BookingListener {
  private readonly logger = new Logger(BookingListener.name);

  constructor(@InjectQueue("payments") private readonly paymentsQueue: Queue) {}

  @OnEvent("BOOKING.CREATED")
  async handleCreated(event: BookingCreatedEvent) {
    this.logger.log(
      `[BOOKING.CREATED] Enfileirando pagamento → booking ${event.bookingId}`,
    );

    await this.paymentsQueue.add(
      "process-payment",
      {
        bookingId: event.bookingId,
        clientId: event.clientId,
        totalPrice: event.totalPrice,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: true,
      },
    );
  }

  @OnEvent("BOOKING.COMPLETED")
  async handleCompleted(event: BookingCompletedEvent) {
    this.logger.log(
      `[BOOKING.COMPLETED] Enfileirando payout → booking ${event.bookingId}`,
    );

    await this.paymentsQueue.add(
      "process-payout",
      {
        bookingId: event.bookingId,
        providerId: event.providerId,
        totalPrice: event.totalPrice,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
      },
    );
  }

  @OnEvent("BOOKING.CANCELLED")
  async handleCancelled(event: BookingCancelledEvent) {
    // if (event.previousStatus !== BookingStatus.CONFIRMED) {
    //   this.logger.log(
    //     `[BOOKING.CANCELLED] Booking ${event.booking.id} estava PENDING — sem refund`,
    //   );
    //   return;
    // }

    this.logger.log(
      `[BOOKING.CANCELLED] Enfileirando refund → booking ${event.booking.id}`,
    );

    await this.paymentsQueue.add(
      "process-refund",
      {
        bookingId: event.booking.id,
        clientId: event.booking.clientId,
        totalPrice: event.booking.totalPrice,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
      },
    );
  }
}
