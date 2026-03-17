import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ForgotPasswordService } from "../services/forgot-password.service";
import { ResetPasswordService } from "../services/reset-password.service";
import { ResetPasswordInput } from "../inputs/reset-password.input";
import { Public } from "@common/decorators/public.decorator";
import { SendOTPInput } from "../inputs/send-otp.input";
import { RateLimitResponse } from "@common/responses/envelope.response";
import { Throttle } from "@nestjs/throttler";

@ApiTags("Auth — Password")
@Public()
@Controller("auth/password")
@ApiResponse({
  status: 429,
  type: RateLimitResponse,
  description: "Demasiadas tentativas",
})
export class AuthPasswordController {
  private readonly logger = new Logger(AuthPasswordController.name);

  constructor(
    private readonly forgotPassword: ForgotPasswordService,
    private readonly resetPassword: ResetPasswordService,
  ) {}

  @Post("forgot")
  @Throttle({ critical_signup: {} })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Solicitar reset de password" })
  @ApiResponse({ status: 200, description: "Código enviado se email existir" })
  async forgot(@Body() input: SendOTPInput) {
    return this.forgotPassword.execute(input.email);
  }

  @Post("reset")
  @Throttle({ critical_auth: {} })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Redefinir password com OTP" })
  @ApiResponse({ status: 200, description: "Password actualizada" })
  @ApiResponse({ status: 401, description: "Código inválido ou expirado" })
  async reset(@Body() input: ResetPasswordInput) {
    return this.resetPassword.execute(input);
  }
}
