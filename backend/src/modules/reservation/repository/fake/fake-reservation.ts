import { Injectable } from '@nestjs/common';
import ReservationEntity, {
  ReservationStatus,
} from '../../entities/reservation.entity';
import ReservationRepository from '../reservation.repo';

@Injectable()
export default class FakeReservationRepository implements ReservationRepository {
  private reservations: ReservationEntity[] = [];

  async create(reservation: ReservationEntity) {
    await Promise.resolve();
    const newReservation = new ReservationEntity(reservation);

    this.reservations.push(newReservation);
    return newReservation;
  }

  async findById(id: string) {
    await Promise.resolve();
    return this.reservations.find((r) => r.id === id) || null;
  }

  async findByProviderAndDate(providerId: string, date: Date) {
    await Promise.resolve();
    return (
      this.reservations.find(
        (r) =>
          r.providerId === providerId &&
          r.date.getTime() === date.getTime() &&
          r.status !== ReservationStatus.CANCELED,
      ) || null
    );
  }

  async cancel(id: string) {
    const reservation = await this.findById(id);
    if (!reservation) throw new Error('Reserva não encontrada');
    reservation.status = ReservationStatus.CANCELED;
  }
}
