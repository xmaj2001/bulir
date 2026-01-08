import { randomUUID } from 'crypto';

export default class ServiceEntity {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public providerId: string;
  public createdAt: Date;
  public updatedAt: Date;
  public reservations?: [];

  constructor(partial: Partial<ServiceEntity>) {
    this.id = partial.id ?? randomUUID();
    this.name = partial.name ?? '';
    this.description = partial.description ?? '';
    this.price = partial.price ?? 0;
    this.providerId = partial.providerId ?? '';
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
    this.reservations = partial.reservations ?? [];
  }

  public updateDetails(name: string, description: string, price: number) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.updatedAt = new Date();
  }
}
