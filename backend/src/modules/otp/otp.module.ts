import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import OtpRepository from './repository/otp.repo';
import FakeOtpRepository from './repository/fake/fake-otp.repo';
import { UserModule } from '../user/user.module';
import { MailSender } from 'src/adapters/mail/mail-sender.port';
import { GoogleScriptMailSender } from 'src/adapters/mail/google-script-mail';
import PrismaOtpRepository from './repository/prisma/prisma.otp.repo';

@Module({
  providers: [
    OtpService,
    {
      provide: OtpRepository,
      useClass: PrismaOtpRepository,
      // useClass: FakeOtpRepository,
    },
    {
      provide: MailSender,
      useClass: GoogleScriptMailSender,
    },
  ],
  imports: [UserModule],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
