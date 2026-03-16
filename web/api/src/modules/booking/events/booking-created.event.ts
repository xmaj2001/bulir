import { DomainEvent } from "@shared/entities/domain-event.base";

export class BookingCreatedEvent extends DomainEvent {
  constructor(
    public readonly bookingId: string,
    public readonly clientId: string,
    public readonly totalPrice: number,
    public readonly providerId: string,
  ) {
    super("BOOKING.CREATED");
  }
}
