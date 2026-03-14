import { DynamicModule, Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repository/user.repo";
import { PrismaUserRepository } from "./infra/prisma-user.repo";
import { FakeUserRepository } from "./infra/fake-user.repo";
import { GetUserService } from "./services/get.user.service";
import { UpdateUserService } from "./services/update.user.service";
import { WalletService } from "./services/wallet.service";
import { WalletController } from "./controllers/wallet.controller";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { UserGateway } from "./websocket/user.gateway";
import { DepositListener } from "./listeners/desposit.listener";

@Module({})
export class UserModule {
  static register(): DynamicModule {
    return {
      module: UserModule,
      controllers: [UserController, WalletController],
      providers: [
        GetUserService,
        UpdateUserService,
        WalletService,
        UserGateway,
        DepositListener,
        { provide: EventBusPort, useClass: EventBusAdapter },
        { provide: UserRepository, useClass: PrismaUserRepository },
      ],
      exports: [UserRepository],
    };
  }

  static onTesting(): DynamicModule {
    return {
      module: UserModule,
      controllers: [UserController, WalletController],
      providers: [
        GetUserService,
        UpdateUserService,
        WalletService,
        UserGateway,
        DepositListener,
        { provide: EventBusPort, useClass: EventBusAdapter },
        { provide: UserRepository, useClass: FakeUserRepository },
      ],
      exports: [UserRepository],
    };
  }
}
