import { DomainEvent } from "@shared/entities/domain-event.base";

interface BookingConfirmedEventProps {
  bookingId: string;
  clientId: string;
  providerId: string;
  totalPrice: number;
}

export class BookingConfirmedEvent extends DomainEvent {
  public readonly bookingId: string;
  public readonly clientId: string;
  public readonly providerId: string;
  public readonly totalPrice: number;
  constructor(props: BookingConfirmedEventProps) {
    super("BOOKING.CONFIRMED");
    Object.assign(this, props);
  }
}
