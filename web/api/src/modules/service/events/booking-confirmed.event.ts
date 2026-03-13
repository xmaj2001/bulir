import { DomainEvent } from "@shared/entities/domain-event.base";
import { BookingEntity } from "../entities/booking.entity";

export class BookingConfirmedEvent extends DomainEvent {
  constructor(public readonly booking: BookingEntity) {
    super("BOOKING.CONFIRMED");
  }
}
