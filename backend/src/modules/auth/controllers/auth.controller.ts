import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  AuthActivateAccountInput,
  AuthChangePasswordInput,
  AuthLoginInput,
  AuthRegisterInput,
} from '../inputs/auth.input';
import type { Request, Response } from 'express';
import type { RequestWithUser } from 'src/shared/http/user-request';
import { AuthGuard } from '../../../shared/guard/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() body: AuthRegisterInput) {
    return this.service.registerUser(body);
  }

  @Post('login')
  async login(@Body() body: AuthLoginInput, @Res() res: Response) {
    const result = await this.service.login(body);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: '/auth/refresh-token',
      sameSite: 'strict',
    });

    return res.send({
      accessToken: result.accessToken,
      user: result.user,
    });
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Res() res: Response) {
    res.clearCookie('refreshToken', {
      path: '/auth/refresh-token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: 'Logout successful' });
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  changePassword(
    @Body() body: AuthChangePasswordInput,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.sub || '';
    return this.service.changePassword(userId, body);
  }

  @Post('account-activation')
  @UseGuards(AuthGuard)
  requestAccountActivation(
    @Body() body: AuthActivateAccountInput,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.sub || '';
    return this.service.activateAccount(userId, body);
  }

  @Post('password-change')
  @UseGuards(AuthGuard)
  requestPasswordChange(@Req() req: RequestWithUser) {
    const userId = req.user?.sub || '';
    return this.service.requestPasswordChange(userId);
  }

  @Post('refresh-token')
  refreshToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const result = this.service.refreshToken(refreshToken);

    return res.send({
      accessToken: result.accessToken,
    });
  }
}
