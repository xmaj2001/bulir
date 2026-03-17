import { IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DepositInput {
  @ApiProperty({
    example: 1000,
    description: "Valor a depositar na carteira",
  })
  @IsNumber({}, { message: "Valor deve ser um número" })
  @Min(10, { message: "O depósito mínimo é de 10 Kz" })
  amount: number;
}
