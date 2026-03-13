import { Module, DynamicModule } from "@nestjs/common";
import { ServiceController } from "./controllers/service.controller";
import { CreateServiceService } from "./services/create-service.service";
import { ServiceRepository } from "./repository/service.repo";
import { PrismaServiceRepository } from "./infra/prisma-service.repo";
import { ServiceCreatedListener } from "./listeners/service-created.listener";
import { UserModule } from "@modules/user/user.module";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { GetServiceService } from "./services/get-service.service";
import { CreateBookingService } from "./services/create-booking.service";
import { BookingRepository } from "./repository/booking.repo";
import { PrismaBookingRepository } from "./infra/prisma-booking.repo";
import { BookingCreatedListener } from "./listeners/booking-created.listener";
import { BookingCompletedListener } from "./listeners/booking-completed.listener";
import { ProcessPaymentProcessor } from "./jobs/process-payment.processor";
import { BullModule } from "@nestjs/bullmq";
import { ServiceGateway } from "./websocket/service.gateway";
import { PrismaModule } from "@shared/database/prisma.module";

@Module({})
export class ServiceModule {
  static register(): DynamicModule {
    return {
      module: ServiceModule,
      controllers: [ServiceController],
      providers: [
        CreateServiceService,
        GetServiceService,
        CreateBookingService,
        ServiceCreatedListener,
        BookingCreatedListener,
        BookingCompletedListener,
        ProcessPaymentProcessor,
        ServiceGateway,
        { provide: ServiceRepository, useClass: PrismaServiceRepository },
        { provide: BookingRepository, useClass: PrismaBookingRepository },
        { provide: EventBusPort, useClass: EventBusAdapter },
      ],
      exports: [ServiceRepository, BookingRepository],
      imports: [
        UserModule.register(),
        PrismaModule,
        BullModule.registerQueue({
          name: "payments",
        }),
      ],
    };
  }
}
