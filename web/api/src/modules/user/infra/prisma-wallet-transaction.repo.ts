import { Injectable } from "@nestjs/common";
import {
  WalletTransactionRepository,
  TransactionFilters,
  PaginatedTransactions,
} from "../repository/wallet-transaction.repo";
import {
  WalletTransactionEntity,
  WalletTxType,
  WalletTxReason,
} from "../entities/wallet-transaction.entity";
import { PrismaService } from "@shared/database/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaWalletTransactionRepository extends WalletTransactionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUserId(
    userId: string,
    filters: TransactionFilters,
  ): Promise<PaginatedTransactions> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(50, filters.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: Prisma.WalletTransactionWhereInput = {
      userId,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.reason ? { reason: filters.reason as WalletTxReason } : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          booking: {
            select: {
              id: true,
              status: true,
              service: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.walletTransaction.count({ where }),
    ]);

    return {
      data: rows.map((r) => this.toEntity(r)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findRecentByUserId(
    userId: string,
    take: number,
  ): Promise<WalletTransactionEntity[]> {
    const rows = await this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });

    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<WalletTransactionEntity | null> {
    const row = await this.prisma.walletTransaction.findUnique({
      where: { id },
      include: {
        booking: {
          select: {
            id: true,
            status: true,
            service: { select: { name: true } },
          },
        },
      },
    });

    return row ? this.toEntity(row) : null;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.walletTransaction.count({ where: { userId } });
  }

  private toEntity(raw: any): WalletTransactionEntity {
    return new WalletTransactionEntity({
      id: raw.id,
      userId: raw.userId,
      bookingId: raw.bookingId ?? undefined,
      type: raw.type as WalletTxType,
      reason: raw.reason as WalletTxReason,
      amount: Number(raw.amount),
      balanceBefore: Number(raw.balanceBefore),
      createdAt: raw.createdAt,
      booking: raw.booking ?? undefined,
    });
  }
}
