import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthLoginInput, AuthRegisterInput } from '../inputs/auth.input';
import type { Response } from 'express';
import type { UserAgentRequest } from 'src/shared/http/user-agent-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() body: AuthRegisterInput) {
    return this.service.registerUser(body);
  }

  @Post('login')
  async login(
    @Body() body: AuthLoginInput,
    @Req() req: UserAgentRequest,
    @Res() res: Response,
  ) {
    const ip = req.ip || 'unknown';
    const device = req.headers['user-agent'] || 'unknown';
    const ua = req.useragent || {
      browser: 'unknown',
      version: 'unknown',
      os: 'unknown',
      platform: 'unknown',
      source: 'unknown',
      isMobile: false,
      isDesktop: false,
    };
    Logger.log(ua);
    const result = await this.service.login(body, ip, device);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: '/auth/refresh-token',
      sameSite: 'strict',
    });

    return res.send({
      accessToken: result.accessToken,
      sessionId: result.sessionId,
    });
  }
}
