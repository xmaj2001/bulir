import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../repository/user.repo";
import { WalletTransactionRepository } from "../repository/wallet-transaction.repo";
import type { TransactionFilters } from "../repository/wallet-transaction.repo";

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepo: WalletTransactionRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async getMyWallet(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) throw new NotFoundException("Utilizador não encontrado");

    const [recentTx, totalTx] = await Promise.all([
      this.walletRepo.findRecentByUserId(userId, 5),
      this.walletRepo.countByUserId(userId),
    ]);

    return {
      balance: Number(user.balance),
      totalTx,
      recentTx: recentTx.map((tx) => tx.publicData()),
    };
  }

  async getMyTransactions(userId: string, filters: TransactionFilters) {
    const result = await this.walletRepo.findByUserId(userId, filters);

    return {
      data: result.data.map((tx) => tx.publicData()),
      meta: result.meta,
    };
  }

  async getTransactionDetail(transactionId: string, requesterId: string) {
    const tx = await this.walletRepo.findById(transactionId);

    if (!tx) throw new NotFoundException("Transacção não encontrada");

    if (tx.userId !== requesterId) {
      throw new ForbiddenException("Sem permissão para ver esta transacção");
    }

    return tx.publicData();
  }

  async getWalletByUserId(userId: string) {
    return this.getMyWallet(userId);
  }
}
