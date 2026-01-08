import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, Max } from 'class-validator';

export class UpdateBalanceInput {
  @IsNotEmpty({ message: 'O valor do saldo é obrigatório' })
  @Type(() => Number)
  @IsPositive({ message: 'O valor do saldo deve ser um número positivo' })
  @Max(1000000, { message: 'O valor do saldo deve ser no máximo 1000000' })
  amount: number;
}
