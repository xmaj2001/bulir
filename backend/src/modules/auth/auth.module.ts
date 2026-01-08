import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { PasswordHasher } from '../../adapters/hasher/password-hasher.port';
import FakePasswordHasher from '../../adapters/hasher/fake-hash';
import { OtpModule } from '../otp/otp.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: PasswordHasher,
      useClass: FakePasswordHasher,
    },
  ],
  imports: [UserModule, OtpModule],
})
export class AuthModule {}
