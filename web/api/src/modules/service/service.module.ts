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
import { ListMyBookingsService } from "./services/list-my-bookings.service";
import { ListProviderBookingsService } from "./services/list-provider-bookings.service";
import { ConfirmBookingService } from "./services/confirm-booking.service";
import { CancelBookingService } from "./services/cancel-booking.service";
import { BookingRepository } from "./repository/booking.repo";
import { PrismaBookingRepository } from "./infra/prisma-booking.repo";
import { BookingListener } from "./listeners/booking.listener";
import { BullModule } from "@nestjs/bullmq";
import { ServiceGateway } from "./websocket/service.gateway";
import { PrismaModule } from "@shared/database/prisma.module";
import { UserGateway } from "@modules/user/websocket/user.gateway";
import { PaymentsProcessor } from "./jobs/payment.processor";

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
        ListMyBookingsService,
        ListProviderBookingsService,
        ConfirmBookingService,
        CancelBookingService,
        BookingListener,
        PaymentsProcessor,
        ServiceGateway,
        ServiceCreatedListener,
        UserGateway,
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
