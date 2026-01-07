import { Body, Post, Req, UseGuards } from '@nestjs/common';
import { OtpService } from '../services/otp.service';
import { OtpValidateInput } from '../inputs/otp-validate.input';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import type { RequestWithUser } from 'src/shared/http/user-request';

export class OtpController {
  constructor(private readonly service: OtpService) {}

  @Post('validate')
  @UseGuards(AuthGuard)
  async validateOtp(
    @Body() body: OtpValidateInput,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.sub || '';
    await this.service.validateOtp(body, userId);
  }
}
