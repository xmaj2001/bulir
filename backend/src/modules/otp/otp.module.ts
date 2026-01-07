import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import OtpRepository from './repository/otp.repo';
import FakeOtpRepository from './repository/fake/fake-otp.repo';
import { UserModule } from '../user/user.module';

@Module({
  providers: [
    OtpService,
    {
      provide: OtpRepository,
      useClass: FakeOtpRepository,
    },
  ],
  imports: [UserModule],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
