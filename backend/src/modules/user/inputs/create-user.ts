import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  MaxLength,
} from 'class-validator';

export class CreateUserInput {
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

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;
}
