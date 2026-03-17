import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";

import { SignUpService } from "../services/sign-up.service";
import { SignInService } from "../services/sign-in.service";
import { EmailSignUpInput } from "../inputs/email-sign-up.input";
import { EmailSignInInput } from "../inputs/email-sign-in.input";
import { Public } from "@common/decorators/public.decorator";
import { setRefreshCookie } from "../helpers/cookie.helper";
import { ConfigService } from "@nestjs/config";
import { Throttle } from "@nestjs/throttler";
import { RateLimitResponse } from "@common/responses/envelope.response";

@ApiTags("Auth — Email")
@Public()
@ApiResponse({
  status: 429,
  type: RateLimitResponse,
  description: "Demasiadas tentativas",
})
@Controller("auth")
export class AuthEmailController {
  private readonly logger = new Logger(AuthEmailController.name);

  constructor(
    private readonly _signUp: SignUpService,
    private readonly _signIn: SignInService,
    private readonly config: ConfigService,
  ) {}

  @Post("sign-up/email")
  @Throttle({ critical_signup: {} })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registar com email + password" })
  @ApiResponse({ status: 201, description: "Conta criada" })
  @ApiResponse({ status: 409, description: "Email já registado" })
  @ApiResponse({ status: 422, description: "Input inválido" })
  async signUp(@Body() input: EmailSignUpInput) {
    return this._signUp.signUpEmail(input);
  }

  @Post("sign-in/email")
  @Throttle({ critical_auth: {} })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login com email + password" })
  @ApiResponse({ status: 200, description: "Login bem-sucedido" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  @ApiResponse({ status: 403, description: "Email não verificado" })
  async signIn(
    @Body() input: EmailSignInInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._signIn.signInEmail(input);
    setRefreshCookie(res, this.config, result.refresh_token);
    return { user: result.user, access_token: result.access_token };
  }
}
