import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bullmq";
import { LoggerModule } from "nestjs-pino";
// import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { appConfig } from "@config/app.config";
// import { throttlerConfig } from "@config/throttler.config";
import { bullConfig } from "@config/bull.config";
import { jwtConfig } from "@config/jwt.config";
import { loggerConfig } from "@config/logger.config";

import { PrismaModule } from "@shared/database/prisma.module";
import { TokenModule } from "@shared/adapters/token/token.module";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";

import { AppController } from "@modules/app/app.controller";
import { AppService } from "@modules/app/app.service";
import { AuthModule } from "@modules/auth/auth.module";
import { UserModule } from "@modules/user/user.module";
import { ServiceModule } from "@modules/service/service.module";
import { BookingModule } from "@modules/booking/booking.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),

    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: throttlerConfig,
    // }),

    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: loggerConfig,
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: bullConfig,
    }),

    PrismaModule,
    EventEmitterModule.forRoot({ wildcard: true }),
    TokenModule,

    AuthModule.register(),
    UserModule.register(),
    ServiceModule.register(),
    BookingModule.register(),
  ],

  controllers: [AppController],

  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // { provide: APP_GUARD, useClass: ThrottlerGuard },
    AppService,
  ],
})
export class AppModule {}
