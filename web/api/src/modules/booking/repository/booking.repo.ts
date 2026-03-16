import { BookingEntity } from "../entities/booking.entity";

export abstract class BookingRepository {
  abstract findById(id: string): Promise<BookingEntity | null>;
  abstract findByClientId(clientId: string): Promise<BookingEntity[]>;
  abstract findByProviderId(providerId: string): Promise<BookingEntity[]>;
  abstract findByServiceId(serviceId: string): Promise<BookingEntity[]>;
  abstract save(booking: BookingEntity): Promise<void>;
  abstract findByStatus(status: string): Promise<BookingEntity[]>;

  abstract processPayment(params: {
    bookingId: string;
    clientId: string;
    totalPrice: number;
  }): Promise<void>;

  abstract processPayout(params: {
    bookingId: string;
    providerId: string;
    totalPrice: number;
  }): Promise<void>;

  abstract processRefund(params: {
    bookingId: string;
    clientId: string;
    totalPrice: number;
  }): Promise<void>;
}
