import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import OtpRepository from './repository/otp.repo';
import FakeOtpRepository from './repository/fake/fake-otp.repo';

@Module({
  providers: [
    OtpService,
    {
      provide: OtpRepository,
      useClass: FakeOtpRepository,
    },
  ],
  exports: [OtpService],
})
export class OtpModule {}
