import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { BookingCreatedEvent } from "../events/booking-created.event";

@Injectable()
export class BookingCreatedListener {
  private readonly logger = new Logger(BookingCreatedListener.name);

  constructor(@InjectQueue("payments") private readonly paymentsQueue: Queue) {}

  @OnEvent("BOOKING.CREATED")
  async handle(event: BookingCreatedEvent) {
    const { bookingId, clientId, totalPrice } = event;
    this.logger.log(`Processando pagamento para booking ${bookingId}`);

    await this.paymentsQueue.add("process-payment", {
      bookingId,
      clientId,
      amount: totalPrice,
    });

    this.logger.log(
      `Job 'process-payment' enfileirado para booking ${bookingId}`,
    );
  }
}
