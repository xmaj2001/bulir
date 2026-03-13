import { DomainEvent } from "@shared/entities/domain-event.base";
import { BookingEntity } from "../entities/booking.entity";

export class BookingCompletedEvent extends DomainEvent {
  constructor(
    public readonly bookingId: string,
    public readonly clientId: string,
    public readonly providerId: string,
    public readonly totalPrice: number,
  ) {
    super("BOOKING.COMPLETED");
  }
}
