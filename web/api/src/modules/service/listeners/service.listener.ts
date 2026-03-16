import { Injectable, Logger } from "@nestjs/common";
import { ServiceCreatedEvent } from "../events/service-created.event";
import { OnEvent } from "@nestjs/event-emitter";
import { ServiceGateway } from "../websocket/service.gateway";

@Injectable()
export class ServiceListener {
  private readonly logger = new Logger(ServiceListener.name);
  constructor(private readonly serviceGateway: ServiceGateway) {}

  @OnEvent("SERVICE.CREATED")
  handle(event: ServiceCreatedEvent) {
    this.logger.log(`Serviço ${event.service.id} criado`);
    this.serviceGateway.broadcastServiceCreated(event.service);
    this.logger.log(`Evento ServiceCreatedEvent emitido`);
  }
}
