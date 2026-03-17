import { WalletTransactionEntity } from "../entities/wallet-transaction.entity";

export interface TransactionFilters {
  type?: "DEBIT" | "CREDIT";
  reason?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTransactions {
  data: WalletTransactionEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export abstract class WalletTransactionRepository {
  abstract findByUserId(
    userId: string,
    filters: TransactionFilters,
  ): Promise<PaginatedTransactions>;

  abstract findRecentByUserId(
    userId: string,
    take: number,
  ): Promise<WalletTransactionEntity[]>;

  abstract findById(id: string): Promise<WalletTransactionEntity | null>;

  abstract countByUserId(userId: string): Promise<number>;
}
