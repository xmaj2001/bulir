import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class UpdateUserInput {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  public name: string;

  @IsNotEmpty({ message: 'NIF é obrigatório' })
  @IsString({ message: 'NIF deve ser uma string' })
  @MaxLength(14, { message: 'NIF deve ter no máximo 14 caracteres' })
  public nif: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  public email: string;

  @IsEnum(['client', 'provider'], {
    message: 'O usuário deve ser client ou provider',
  })
  public role: 'client' | 'provider';
}

export class updateUserBalanceInput {
  @IsNotEmpty({ message: 'Balance é obrigatório' })
  @IsPositive({ message: 'Balance deve ser um número positivo' })
  @Type(() => Number)
  public balance: number;
}
