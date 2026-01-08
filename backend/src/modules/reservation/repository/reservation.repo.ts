import ReservationEntity from '../entities/reservation.entity';

export default abstract class ReservationRepository {
  abstract create(
    reservation: ReservationEntity,
    tx?: any,
  ): Promise<ReservationEntity | null>;

  abstract findById(id: string): Promise<ReservationEntity | null>;

  abstract findByClientId(clientId: string): Promise<ReservationEntity[]>;

  abstract findByServiceId(
    serviceId: string,
    clientId: string,
  ): Promise<ReservationEntity[]>;

  abstract cancel(id: string, tx?: any): Promise<boolean>;
}
