import { ServiceEntity } from "@modules/service/entities/service.entity";
import { BadRequestException } from "@nestjs/common";
import { BaseEntity } from "@shared/entities/base.entity";

export enum BookingStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
}

export interface ClientProps {
  name: string;
  nif: string;
  email: string;
  avatarUrl?: string;
}

export interface BookingProps {
  clientId: string;
  client?: ClientProps;
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
  client?: ClientProps;

  constructor(props: BookingProps) {
    if (!props.clientId) {
      throw new BadRequestException("Reserva deve ter um cliente");
    }
    if (!props.serviceId) {
      throw new BadRequestException("Reserva deve ter um serviço");
    }
    if (props.totalPrice <= 0) {
      throw new BadRequestException("Preço da reserva deve ser maior que zero");
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
    this.client = props.client;
  }

  complete(): void {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        `Não é possível completar uma reserva com status ${this.status}`,
      );
    }
    this.status = BookingStatus.COMPLETED;
    this.completedAt = new Date();
    this.touch();
  }

  confirm(): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Não é possível confirmar uma reserva com status ${this.status}`,
      );
    }
    this.status = BookingStatus.CONFIRMED;
    this.confirmedAt = new Date();
    this.touch();
  }

  cancel(reason?: string): void {
    const cancellable = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
    if (!cancellable.includes(this.status)) {
      throw new BadRequestException(
        `Não é possível cancelar uma reserva com status ${this.status}`,
      );
    }
    this.status = BookingStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancelReason = reason;
    this.touch();
  }

  isCancellable(): boolean {
    return this.status === BookingStatus.PENDING;
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
      client: this.client,
      serviceId: this.serviceId,
      service: this.service?.publicData(),
      totalPrice: this.totalPrice,
      notes: this.notes,
      scheduledAt: this.scheduledAt,
      status: this.status,
      completedAt: this.completedAt,
      cancelledAt: this.cancelledAt,
      cancelReason: this.cancelReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
