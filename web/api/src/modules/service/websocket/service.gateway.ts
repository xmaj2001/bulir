import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { ServiceEntity } from "../entities/service.entity";
import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(ServiceEntity)
@WebSocketGateway({
  namespace: "services",
  cors: {
    origin: "*", // TODO: mudar para a url do frontend
  },
})
export class ServiceGateway {
  private readonly logger = new Logger(ServiceGateway.name);

  @WebSocketServer()
  private server: Server;
  constructor() {}

  broadcastServiceCreated(payload: ServiceEntity) {
    this.logger.log(`Broadcast service:created → ${payload.id}`);
    this.server.emit("service:created", payload);
  }

  broadcastServiceDeactivated(payload: ServiceEntity) {
    this.logger.log(`Broadcast service:deactivated → ${payload.id}`);
    this.server.emit("service:deactivated", payload.id);
  }
}
