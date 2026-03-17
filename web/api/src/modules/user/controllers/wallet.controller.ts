import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { WalletService } from "../services/wallet.service";
import { DepositInput } from "../inputs/deposit.input";

@ApiTags("Wallet")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("deposit")
  @ApiOperation({ summary: "Adicionar saldo à carteira" })
  async deposit(@CurrentUser() user: AuthUser, @Body() input: DepositInput) {
    return this.walletService.deposit(user.sub, input.amount);
  }

  @Get("balance")
  @ApiOperation({ summary: "Ver saldo actual da carteira" })
  async getBalance(@CurrentUser() user: AuthUser) {
    return this.walletService.getBalance(user.sub);
  }
}
