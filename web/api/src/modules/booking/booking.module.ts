import { Module, DynamicModule } from "@nestjs/common";
import { BookingController } from "./controllers/booking.controller";
import { UserModule } from "@modules/user/user.module";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { CreateBookingService } from "./services/create-booking.service";
import { ListMyBookingsService } from "./services/list-my-bookings.service";
import { ListProviderBookingsService } from "./services/list-order.service";
import { CancelBookingService } from "./services/cancel-booking.service";
import { BookingRepository } from "./repository/booking.repo";
import { PrismaBookingRepository } from "./infra/prisma-booking.repo";
import { BookingListener } from "./listeners/booking.listener";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "@shared/database/prisma.module";
import { UserGateway } from "@modules/user/websocket/user.gateway";
import { PaymentsProcessor } from "./jobs/payment.processor";
import { ServiceModule } from "@modules/service/service.module";
import { CompleteBookingService } from "./services/complete-booking.service";
import { BookingGateway } from "./websocket/booking.gateway";

@Module({})
export class BookingModule {
  static register(): DynamicModule {
    return {
      module: BookingModule,
      controllers: [BookingController],
      providers: [
        CreateBookingService,
        ListMyBookingsService,
        ListProviderBookingsService,
        CompleteBookingService,
        CancelBookingService,
        BookingListener,
        PaymentsProcessor,
        BookingGateway,
        UserGateway,
        { provide: BookingRepository, useClass: PrismaBookingRepository },
        { provide: EventBusPort, useClass: EventBusAdapter },
      ],
      exports: [BookingRepository],
      imports: [
        UserModule.register(),
        ServiceModule.register(),
        PrismaModule,
        BullModule.registerQueue({
          name: "payments",
        }),
      ],
    };
  }
}
