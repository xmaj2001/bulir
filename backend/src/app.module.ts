import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ServiceModule } from './modules/service/service.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { OtpModule } from './modules/otp/otp.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: 'your_jwt_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    ServiceModule,
    ReservationModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
