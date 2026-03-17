import { BadRequestException } from "@nestjs/common";

export enum WalletTxType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export enum WalletTxReason {
  BOOKING_PAYMENT = "BOOKING_PAYMENT",
  BOOKING_REFUND = "BOOKING_REFUND",
  BOOKING_RECEIPT = "BOOKING_RECEIPT",
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT",
}

const VALID_TYPE_REASON: Record<WalletTxReason, WalletTxType> = {
  [WalletTxReason.BOOKING_PAYMENT]: WalletTxType.DEBIT,
  [WalletTxReason.BOOKING_REFUND]: WalletTxType.CREDIT,
  [WalletTxReason.BOOKING_RECEIPT]: WalletTxType.CREDIT,
  [WalletTxReason.MANUAL_ADJUSTMENT]: WalletTxType.CREDIT,
};

interface WalletTransactionProps {
  id?: string;
  userId: string;
  bookingId?: string;
  type: WalletTxType;
  reason: WalletTxReason;
  amount: number;
  balanceBefore: number;
  createdAt?: Date;
  booking?: {
    id: string;
    status: string;
    service: { name: string };
  };
}

export class WalletTransactionEntity {
  public readonly id: string;
  public readonly userId: string;
  public readonly bookingId?: string;
  public readonly type: WalletTxType;
  public readonly reason: WalletTxReason;
  public readonly amount: number;
  public readonly balanceBefore: number;
  public readonly balanceAfter: number;
  public readonly createdAt: Date;
  public readonly booking?: WalletTransactionProps["booking"];

  constructor(props: WalletTransactionProps) {
    this.validateAmount(props.amount);
    this.validateTypeReason(props.type, props.reason);

    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.bookingId = props.bookingId;
    this.type = props.type;
    this.reason = props.reason;
    this.amount = props.amount;
    this.balanceBefore = props.balanceBefore;
    this.balanceAfter = this.calcBalanceAfter(
      props.type,
      props.balanceBefore,
      props.amount,
    );
    this.createdAt = props.createdAt ?? new Date();
    this.booking = props.booking;
  }

  static debit(props: {
    userId: string;
    bookingId: string;
    reason: WalletTxReason.BOOKING_PAYMENT;
    amount: number;
    balanceBefore: number;
  }): WalletTransactionEntity {
    return new WalletTransactionEntity({
      ...props,
      type: WalletTxType.DEBIT,
    });
  }

  static credit(props: {
    userId: string;
    bookingId?: string;
    reason:
      | WalletTxReason.BOOKING_REFUND
      | WalletTxReason.BOOKING_RECEIPT
      | WalletTxReason.MANUAL_ADJUSTMENT;
    amount: number;
    balanceBefore: number;
  }): WalletTransactionEntity {
    return new WalletTransactionEntity({
      ...props,
      type: WalletTxType.CREDIT,
    });
  }

  get isDebit(): boolean {
    return this.type === WalletTxType.DEBIT;
  }
  get isCredit(): boolean {
    return this.type === WalletTxType.CREDIT;
  }

  publicData() {
    return {
      id: this.id,
      type: this.type,
      reason: this.reason,
      amount: this.amount,
      balanceBefore: this.balanceBefore,
      balanceAfter: this.balanceAfter,
      bookingId: this.bookingId,
      createdAt: this.createdAt,
      booking: this.booking,
    };
  }

  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException(
        "O valor da transacção deve ser maior que zero",
      );
    }
  }

  private validateTypeReason(type: WalletTxType, reason: WalletTxReason): void {
    const expectedType = VALID_TYPE_REASON[reason];
    if (expectedType !== type) {
      throw new BadRequestException(
        `Combinação inválida: reason "${reason}" exige type "${expectedType}", recebeu "${type}"`,
      );
    }
  }

  private calcBalanceAfter(
    type: WalletTxType,
    balanceBefore: number,
    amount: number,
  ): number {
    const result =
      type === WalletTxType.DEBIT
        ? balanceBefore - amount
        : balanceBefore + amount;

    if (result < 0) {
      throw new BadRequestException(
        `Saldo insuficiente: saldo actual ${balanceBefore}, tentativa de debitar ${amount}`,
      );
    }

    return Math.round(result * 100) / 100; // evita floating point artifacts
  }
}
