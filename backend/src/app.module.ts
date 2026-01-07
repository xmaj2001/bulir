import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ServiceModule } from './modules/service/service.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { OtpModule } from './modules/otp/otp.module';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: getCacheTTL('1h'), // seconds
    //   max: getCacheTTL('12h'), // maximum number of items in cache
    // }),
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
  providers: [AppService],
})
export class AppModule {}
