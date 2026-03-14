import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { DepositEvent } from "../events/deposit-event";
import { BookingCreatedEvent } from "@modules/service/events/booking-created.event";

@ApiExtraModels(DepositEvent)
@WebSocketGateway({
  namespace: "user",
  cors: {
    origin: "*", // TODO: mudar para a url do frontend
  },
})
export class UserGateway {
  private readonly logger = new Logger(UserGateway.name);

  @WebSocketServer()
  private server: Server;
  constructor() {}

  deposit(payload: DepositEvent) {
    this.logger.log(`Broadcast user:deposit → ${payload.userId}`);
    this.server.emit("user:deposit", payload);
  }

  bookingCreated(payload: BookingCreatedEvent) {
    this.logger.log(`Broadcast user:bookingCreated → ${payload.clientId}`);
    this.server.emit("user:bookingCreated", payload);
  }
}
