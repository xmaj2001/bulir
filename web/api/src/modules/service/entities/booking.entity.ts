import { BaseEntity } from "@shared/entities/base.entity";
import { ServiceEntity } from "./service.entity";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface BookingProps {
  clientId: string;
  serviceId: string;
  totalPrice: number;
  notes?: string;
  scheduledAt?: Date;
  status?: BookingStatus;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  service?: ServiceEntity;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BookingEntity extends BaseEntity {
  clientId: string;
  serviceId: string;
  totalPrice: number;
  notes?: string;
  scheduledAt?: Date;

  status: BookingStatus;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  service?: ServiceEntity;

  constructor(props: BookingProps) {
    if (!props.clientId) {
      throw new Error("Reserva deve ter um cliente");
    }
    if (!props.serviceId) {
      throw new Error("Reserva deve ter um serviço");
    }
    if (props.totalPrice <= 0) {
      throw new Error("Preço da reserva deve ser maior que zero");
    }

    super(props.id, props.createdAt, props.updatedAt);
    this.clientId = props.clientId;
    this.serviceId = props.serviceId;
    this.totalPrice = props.totalPrice;
    this.notes = props.notes;
    this.scheduledAt = props.scheduledAt;
    this.status = props.status ?? BookingStatus.PENDING;
    this.confirmedAt = props.confirmedAt;
    this.completedAt = props.completedAt;
    this.cancelledAt = props.cancelledAt;
    this.cancelReason = props.cancelReason;
    this.service = props.service;
  }

  confirm(): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error(
        `Não é possível confirmar uma reserva com status ${this.status}`,
      );
    }
    this.status = BookingStatus.CONFIRMED;
    this.confirmedAt = new Date();
    this.touch();
  }

  complete(): void {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new Error(
        `Não é possível completar uma reserva com status ${this.status}`,
      );
    }
    this.status = BookingStatus.COMPLETED;
    this.completedAt = new Date();
    this.touch();
  }

  cancel(reason?: string): void {
    const cancellable = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
    if (!cancellable.includes(this.status)) {
      throw new Error(
        `Não é possível cancelar uma reserva com status ${this.status}`,
      );
    }
    this.status = BookingStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancelReason = reason;
    this.touch();
  }

  isOwnedByClient(clientId: string): boolean {
    return this.clientId === clientId;
  }

  isCancellable(): boolean {
    return (
      this.status === BookingStatus.PENDING ||
      this.status === BookingStatus.CONFIRMED
    );
  }

  isCompleted(): boolean {
    return this.status === BookingStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }

  publicData() {
    return {
      id: this.id,
      clientId: this.clientId,
      serviceId: this.serviceId,
      service: this.service?.publicData(),
      totalPrice: this.totalPrice,
      notes: this.notes,
      scheduledAt: this.scheduledAt,
      status: this.status,
      confirmedAt: this.confirmedAt,
      completedAt: this.completedAt,
      cancelledAt: this.cancelledAt,
      cancelReason: this.cancelReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
