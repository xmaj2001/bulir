import { DomainEvent } from "@shared/entities/domain-event.base";
import { ServiceEntity } from "../entities/service.entity";

export class ServiceCreatedEvent extends DomainEvent {
  constructor(public readonly service: ServiceEntity) {
    super("SERVICE.CREATED");
  }
}
