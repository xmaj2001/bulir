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
import { Public } from "@common/decorators/public.decorator";
import { setRefreshCookie } from "../helpers/cookie.helper";
import { ConfigService } from "@nestjs/config";
import { NifSignUpInput } from "../inputs/nif-sign-up.input";
import { NifSignInInput } from "../inputs/nif-sign-in.input";
// import { Throttle } from "@nestjs/throttler";
import { RateLimitResponse } from "@common/responses/envelope.response";

@ApiTags("Auth — NIF")
@Public()
@Controller("auth")
export class AuthNifController {
  private readonly logger = new Logger(AuthNifController.name);

  constructor(
    private readonly _signUp: SignUpService,
    private readonly _signIn: SignInService,
    private readonly config: ConfigService,
  ) {}

  @Post("sign-up/nif")
  // @Throttle({ critical_signup: {} })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registar com nif + password" })
  @ApiResponse({ status: 201, description: "Conta criada" })
  @ApiResponse({ status: 409, description: "NIF já registado" })
  @ApiResponse({ status: 422, description: "Input inválido" })
  @ApiResponse({
    status: 429,
    type: RateLimitResponse,
    description: "Demasiadas tentativas",
  })
  async signUp(@Body() input: NifSignUpInput) {
    return this._signUp.signUpNif(input);
  }

  @Post("sign-in/nif")
  // @Throttle({ critical_auth: {} })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login com nif + password" })
  @ApiResponse({ status: 200, description: "Login bem-sucedido" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  @ApiResponse({ status: 403, description: "NIF não verificado" })
  @ApiResponse({
    status: 429,
    type: RateLimitResponse,
    description: "Demasiadas tentativas",
  })
  async signIn(
    @Body() input: NifSignInInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._signIn.signInNif(input);
    setRefreshCookie(res, this.config, result.refresh_token);
    return { user: result.user, access_token: result.access_token };
  }
}
