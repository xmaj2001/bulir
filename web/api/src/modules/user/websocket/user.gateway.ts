import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { DepositEvent } from "../events/deposit-event";
import { BookingCreatedEvent } from "@modules/service/events/booking-created.event";
import { UserRepository } from "../repository/user.repo";

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
  constructor(private readonly userRepo: UserRepository) {}

  deposit(payload: DepositEvent) {
    this.logger.log(`Broadcast user:deposit → ${payload.userId}`);
    this.server.emit("user:deposit", payload);
  }

  async bookingCreated(payload: { clientId: string; balanceAfter: number }) {
    this.logger.log(`Broadcast user:bookingCreated → ${payload.clientId}`);
    const user = await this.userRepo.findById(payload.clientId);
    if (!user) {
      this.logger.warn(`User not found: ${payload.clientId}`);
      return;
    }
    this.server.emit("user:bookingCreated", {
      userId: payload.clientId,
      balanceAfter: user.getbalance(), // TODO: Mudar o nome do método para getBalance()
    });
  }
}
