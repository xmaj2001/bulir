import { Module, DynamicModule } from "@nestjs/common";
import { ServiceController } from "./controllers/service.controller";
import { CreateServiceService } from "./services/create-service.service";
import { ServiceRepository } from "./repository/service.repo";
import { PrismaServiceRepository } from "./infra/prisma-service.repo";
import { UserModule } from "@modules/user/user.module";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { GetServiceService } from "./services/get-service.service";
import { ServiceGateway } from "./websocket/service.gateway";
import { PrismaModule } from "@shared/database/prisma.module";
import { UserGateway } from "@modules/user/websocket/user.gateway";
import { ServiceListener } from "./listeners/service.listener";

@Module({})
export class ServiceModule {
  static register(): DynamicModule {
    return {
      module: ServiceModule,
      controllers: [ServiceController],
      providers: [
        CreateServiceService,
        GetServiceService,
        ServiceGateway,
        ServiceListener,
        UserGateway,
        { provide: ServiceRepository, useClass: PrismaServiceRepository },
        { provide: EventBusPort, useClass: EventBusAdapter },
      ],
      exports: [ServiceRepository],
      imports: [UserModule.register(), PrismaModule],
    };
  }
}
