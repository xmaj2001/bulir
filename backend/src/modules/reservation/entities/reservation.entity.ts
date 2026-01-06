import { randomUUID } from 'crypto';

export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

export default class ReservationEntity {
  public id: string;
  public serviceId: string;
  public providerId: string;
  public clientId: string;
  public status: ReservationStatus;
  public createdAt: Date;
  public canceledAt?: Date;
  constructor(partial: Partial<ReservationEntity>) {
    this.id = partial.id || randomUUID();
    Object.assign(this, partial);
  }
}
