import { Injectable } from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";

@Injectable()
export class ListProviderBookingsService {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(providerId: string) {
    const bookings = await this.bookingRepo.findByProviderId(providerId);
    return bookings.map((b) => b.publicData());
  }
}
