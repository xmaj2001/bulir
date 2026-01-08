import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ServiceModule } from './modules/service/service.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { OtpModule } from './modules/otp/otp.module';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    AuthModule,
    ServiceModule,
    ReservationModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
