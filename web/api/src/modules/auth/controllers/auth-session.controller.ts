import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { RefreshTokenService } from "../services/refresh-token.service";
import { Public } from "@common/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { setRefreshCookie } from "../helpers/cookie.helper";
// import { Throttle } from "@nestjs/throttler";
import { RateLimitResponse } from "@common/responses/envelope.response";

@ApiTags("Auth — Session")
@Public()
@ApiResponse({
  status: 429,
  type: RateLimitResponse,
  description: "Demasiadas tentativas",
})
@Controller("auth")
export class AuthSessionController {
  private readonly logger = new Logger(AuthSessionController.name);

  constructor(
    private readonly refreshToken: RefreshTokenService,
    private readonly config: ConfigService,
  ) {}

  @Post("refresh")
  // @Throttle({ high: {} })
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: "Renovar access token via refresh token (cookie)" })
  @ApiResponse({ status: 200, description: "Novo access token" })
  @ApiResponse({ status: 401, description: "Refresh token inválido" })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies?.["refresh_token"];
    const result = await this.refreshToken.execute(rt);
    setRefreshCookie(res, this.config, result.refresh_token);
    return { access_token: result.access_token };
  }

  @Post("sign-out")
  // @Throttle({ medium: {} })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Terminar sessão" })
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
    return { message: "Sessão terminada" };
  }
}
