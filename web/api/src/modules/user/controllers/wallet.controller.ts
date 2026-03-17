import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Roles } from "@common/decorators/roles.decorator";
import { WalletService } from "../services/wallet.service";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@common/responses/envelope.response";
import {
  PaginatedTransactionsResponse,
  WalletSummaryResponse,
  WalletTransactionResponse,
} from "../responses/wallet.response";

@ApiTags("Wallet")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get("me")
  @ApiOperation({ summary: "Carteira do usuário" })
  @ApiResponse({
    status: 200,
    type: ApiSuccessResponse(WalletSummaryResponse),
    description: "Carteira encontrada",
  })
  @ApiResponse({
    status: 404,
    type: ApiErrorResponse,
    description: "Carteira não encontrada",
  })
  @ApiResponse({
    status: 403,
    type: ApiErrorResponse,
    description: "Sem permissão para ver carteira",
  })
  getWallet(@CurrentUser() user: AuthUser) {
    return this.walletService.getMyWallet(user.sub);
  }

  @Get("me/transactions")
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "type", required: false, enum: ["DEBIT", "CREDIT"] })
  @ApiQuery({ name: "reason", required: false })
  @ApiOperation({ summary: "Listar transações" })
  @ApiResponse({
    status: 200,
    type: ApiSuccessResponse(PaginatedTransactionsResponse),
    description: "Transações listadas",
  })
  @ApiResponse({
    status: 404,
    type: ApiErrorResponse,
    description: "Transações não encontradas",
  })
  @ApiResponse({
    status: 403,
    type: ApiErrorResponse,
    description: "Sem permissão para ver transações",
  })
  async listTransactions(
    @CurrentUser() user: AuthUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("type") type?: "DEBIT" | "CREDIT",
    @Query("reason") reason?: string,
  ) {
    const result = await this.walletService.getMyTransactions(user.sub, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      type,
      reason,
    });

    return {
      items: result.data,
      meta: result.meta,
    };
  }

  @Get("me/transactions/:id")
  @ApiOperation({ summary: "Detalhes de uma transação" })
  @ApiResponse({
    status: 200,
    type: ApiSuccessResponse(WalletTransactionResponse),
    description: "Transação encontrada",
  })
  @ApiResponse({
    status: 404,
    type: ApiErrorResponse,
    description: "Transação não encontrada",
  })
  @ApiResponse({
    status: 403,
    type: ApiErrorResponse,
    description: "Sem permissão para ver esta transação",
  })
  getTransaction(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.walletService.getTransactionDetail(id, user.sub);
  }
}
