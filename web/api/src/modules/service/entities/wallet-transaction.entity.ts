import { BaseEntity } from "@shared/entities/base.entity";

// Espelha os enums do Prisma
export enum WalletTxType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export enum WalletTxReason {
  BOOKING_PAYMENT = "BOOKING_PAYMENT", // DEBIT  → CLIENT   (ao reservar)
  BOOKING_RECEIPT = "BOOKING_RECEIPT", // CREDIT → PROVIDER (ao completar)
  BOOKING_REFUND = "BOOKING_REFUND", // CREDIT → CLIENT   (ao cancelar)
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT", // ADMIN  → qualquer utilizador
}

export interface WalletTransactionProps {
  userId: string;
  type: WalletTxType;
  reason: WalletTxReason;
  amount: number;
  balanceBefore: number;
  bookingId?: string;
}

export class WalletTransactionEntity extends BaseEntity {
  readonly userId: string;
  readonly bookingId?: string;
  readonly type: WalletTxType;
  readonly reason: WalletTxReason;
  readonly amount: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;

  constructor(props: WalletTransactionProps) {
    // ── Invariantes de domínio ──────────────────────────────────────
    if (!props.userId) {
      throw new Error("Transação deve ter um utilizador");
    }
    if (props.amount <= 0) {
      throw new Error("Valor da transação deve ser maior que zero");
    }
    if (props.balanceBefore < 0) {
      throw new Error("Saldo anterior não pode ser negativo");
    }

    // Valida coerência entre tipo e motivo
    const debitReasons = [WalletTxReason.BOOKING_PAYMENT];
    const creditReasons = [
      WalletTxReason.BOOKING_RECEIPT,
      WalletTxReason.BOOKING_REFUND,
      WalletTxReason.MANUAL_ADJUSTMENT,
    ];

    if (
      props.type === WalletTxType.DEBIT &&
      !debitReasons.includes(props.reason)
    ) {
      throw new Error(`Motivo "${props.reason}" inválido para transação DEBIT`);
    }
    if (
      props.type === WalletTxType.CREDIT &&
      !creditReasons.includes(props.reason)
    ) {
      throw new Error(
        `Motivo "${props.reason}" inválido para transação CREDIT`,
      );
    }
    // ───────────────────────────────────────────────────────────────

    super();
    this.userId = props.userId;
    this.bookingId = props.bookingId;
    this.type = props.type;
    this.reason = props.reason;
    this.amount = props.amount;
    this.balanceBefore = props.balanceBefore;

    // balanceAfter é calculado automaticamente — nunca recebe de fora
    this.balanceAfter =
      props.type === WalletTxType.DEBIT
        ? props.balanceBefore - props.amount
        : props.balanceBefore + props.amount;

    // Garante que o saldo nunca fica negativo após débito
    if (this.balanceAfter < 0) {
      throw new Error("Saldo insuficiente para realizar esta transação");
    }
  }

  // ── Factory methods — clareza semântica no service ──────────────

  static debit(params: {
    userId: string;
    amount: number;
    balanceBefore: number;
    reason: WalletTxReason;
    bookingId?: string;
  }): WalletTransactionEntity {
    return new WalletTransactionEntity({
      ...params,
      type: WalletTxType.DEBIT,
    });
  }

  static credit(params: {
    userId: string;
    amount: number;
    balanceBefore: number;
    reason: WalletTxReason;
    bookingId?: string;
  }): WalletTransactionEntity {
    return new WalletTransactionEntity({
      ...params,
      type: WalletTxType.CREDIT,
    });
  }

  publicData() {
    return {
      id: this.id,
      userId: this.userId,
      bookingId: this.bookingId,
      type: this.type,
      reason: this.reason,
      amount: this.amount,
      balanceBefore: this.balanceBefore,
      balanceAfter: this.balanceAfter,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
