import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bullmq";
import { LoggerModule } from "nestjs-pino";
import { appConfig } from "@config/app.config";
import { PrismaModule } from "@shared/database/prisma.module";
import { AuthModule } from "@modules/auth/auth.module";
import { UserModule } from "@modules/user/user.module";
import { TokenModule } from "@shared/adapters/token/token.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { AppController } from "@modules/app/app.controller";
import { AppService } from "@modules/app/app.service";
import { ServiceModule } from "@modules/service/service.module";
import { BookingModule } from "@modules/booking/booking.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        pinoHttp: {
          level: cfg.get("log.level") ?? "debug",
          transport: cfg.get<boolean>("log.pretty")
            ? {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: "SYS:HH:MM:ss",
                  ignore: "pid,hostname",
                },
              }
            : undefined,
          redact: ["req.headers.authorization", 'req.headers["x-signature"]'],
        },
      }),
    }),

    PrismaModule,
    EventEmitterModule.forRoot({ wildcard: true }),

    TokenModule,

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>("jwt.accessSecret"),
        signOptions: { expiresIn: cfg.get<string>("jwt.accessExpiresIn") },
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        connection: {
          host: cfg.get<string>("redis.host"),
          port: cfg.get<number>("redis.port"),
          password: cfg.get<string>("redis.password"),
        },
      }),
    }),

    AuthModule.register(),
    UserModule.register(),
    ServiceModule.register(),
    BookingModule.register(),
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, AppService],
})
export class AppModule {}
