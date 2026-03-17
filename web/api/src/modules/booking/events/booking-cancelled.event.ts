import { DomainEvent } from "@shared/entities/domain-event.base";
import { BookingEntity, BookingStatus } from "../entities/booking.entity";

export class BookingCancelledEvent extends DomainEvent {
  constructor(
    public readonly booking: BookingEntity,
    public readonly previousStatus: BookingStatus,
  ) {
    super("BOOKING.CANCELLED");
  }
}
