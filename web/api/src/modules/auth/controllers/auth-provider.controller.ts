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
import { ProviderSignInService } from "../services/provider-sign-in.service";
import { ProviderSignInInput } from "../inputs/provider-sign-in.input";
import { Public } from "@common/decorators/public.decorator";
import { setRefreshCookie } from "../helpers/cookie.helper";
import { ConfigService } from "@nestjs/config";

@ApiTags("Auth — Provider")
@Public()
@Controller("auth")
export class AuthProviderController {
  private readonly logger = new Logger(AuthProviderController.name);

  constructor(
    private readonly providerSignIn: ProviderSignInService,
    private readonly config: ConfigService,
  ) {}

  @Post("provider")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login/Registo via OAuth (Google, GitHub, 42Intra)",
  })
  @ApiResponse({
    status: 200,
    description: "Login bem-sucedido — tokens devolvidos",
  })
  async providerAuth(
    @Body() input: ProviderSignInInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.providerSignIn.execute(input);
    setRefreshCookie(res, this.config, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken };
  }
}
