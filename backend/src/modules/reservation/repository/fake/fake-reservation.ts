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

  async findByClientId(clientId: string) {
    await Promise.resolve();
    return this.reservations.filter((r) => r.clientId === clientId);
  }

  async cancel(id: string) {
    const reservation = await this.findById(id);
    if (!reservation) return;
    reservation.status = ReservationStatus.CANCELED;
    reservation.canceledAt = new Date();
    this.reservations = this.reservations.map((r) =>
      r.id === id ? reservation : r,
    );
  }
}
