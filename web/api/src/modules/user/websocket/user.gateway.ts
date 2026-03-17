import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { DepositEvent } from "../events/deposit-event";
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
}
