import ReservationEntity from '../entities/reservation.entity';

export default abstract class ReservationRepository {
  abstract create(
    reservation: ReservationEntity,
  ): Promise<ReservationEntity | null>;

  abstract findById(id: string): Promise<ReservationEntity | null>;

  abstract findByClientId(clientId: string): Promise<ReservationEntity[]>;

  abstract cancel(id: string): Promise<void>;
}
