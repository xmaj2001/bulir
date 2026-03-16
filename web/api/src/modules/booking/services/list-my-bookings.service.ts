import { Injectable } from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";

@Injectable()
export class ListMyBookingsService {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(clientId: string) {
    const bookings = await this.bookingRepo.findByClientId(clientId);
    return bookings.map((b) => b.publicData());
  }
}
