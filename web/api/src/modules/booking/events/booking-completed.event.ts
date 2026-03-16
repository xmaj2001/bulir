import { DomainEvent } from "@shared/entities/domain-event.base";

interface BookingCompletedEventProps {
  bookingId: string;
  clientId: string;
  providerId: string;
  totalPrice: number;
}

export class BookingCompletedEvent extends DomainEvent {
  public readonly bookingId: string;
  public readonly clientId: string;
  public readonly providerId: string;
  public readonly totalPrice: number;
  constructor(props: BookingCompletedEventProps) {
    super("BOOKING.COMPLETED");
    Object.assign(this, props);
  }
}
