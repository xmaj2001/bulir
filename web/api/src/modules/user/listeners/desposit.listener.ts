import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserGateway } from "../websocket/user.gateway";
import { DepositEvent } from "../events/deposit-event";

@Injectable()
export class DepositListener {
  private readonly logger = new Logger(DepositListener.name);
  constructor(private readonly userGateway: UserGateway) {}

  @OnEvent("USER.DEPOSIT")
  handle(event: DepositEvent) {
    this.logger.log(`Depósito ${event.userId} criado`);
    this.logger.log(`Evento DepositEvent emitido`);
  }
}
