import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ServiceRefResponse {
  @ApiProperty({ example: "Corte de cabelo" })
  name: string;
}

export class BookingRefResponse {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({
    example: "CONFIRMED",
    enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
  })
  status: string;

  @ApiProperty({ type: () => ServiceRefResponse })
  service: ServiceRefResponse;
}

export class PaginationMetaResponse {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class WalletTransactionResponse {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ enum: ["DEBIT", "CREDIT"], example: "DEBIT" })
  type: string;

  @ApiProperty({
    enum: [
      "BOOKING_PAYMENT",
      "BOOKING_REFUND",
      "BOOKING_RECEIPT",
      "MANUAL_ADJUSTMENT",
    ],
    example: "BOOKING_PAYMENT",
  })
  reason: string;

  @ApiProperty({ example: 500.0 })
  amount: number;

  @ApiProperty({ example: 5500.0 })
  balanceBefore: number;

  @ApiProperty({ example: 5000.0 })
  balanceAfter: number;

  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440000" })
  bookingId?: string;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  createdAt: Date;

  @ApiPropertyOptional({ type: () => BookingRefResponse })
  booking?: BookingRefResponse;
}

export class WalletSummaryResponse {
  @ApiProperty({ example: 5000.0, description: "Saldo actual em Kz" })
  balance: number;

  @ApiProperty({ example: 12, description: "Total de transacções" })
  totalTx: number;

  @ApiProperty({
    type: [WalletTransactionResponse],
    description: "Últimas 5 transacções",
  })
  recentTx: WalletTransactionResponse[];
}

export class PaginatedTransactionsResponse {
  @ApiProperty({ type: [WalletTransactionResponse] })
  items: WalletTransactionResponse[];

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}
