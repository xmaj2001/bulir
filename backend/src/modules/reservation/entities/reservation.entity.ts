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
  public updatedAt: Date;
  public price: number;
  public canceledAt?: Date;
  constructor(partial: Partial<ReservationEntity>) {
    this.id = partial.id || randomUUID();
    this.price = partial.price || 0;
    this.status = partial.status || ReservationStatus.CONFIRMED;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
    Object.assign(this, partial);
  }
}
