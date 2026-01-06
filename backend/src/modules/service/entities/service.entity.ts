import { randomUUID } from 'crypto';

export default class ServiceEntity {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public providerId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    name: string,
    description: string,
    price: number,
    providerId: string,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.description = description;
    this.price = price;
    this.providerId = providerId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public updateDetails(name: string, description: string, price: number) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.updatedAt = new Date();
  }
}
