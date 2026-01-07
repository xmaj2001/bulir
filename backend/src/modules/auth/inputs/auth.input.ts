import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AuthLoginInput {
  @ValidateIf((o) => !o.nif)
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  @IsString({ message: 'O email deve ser uma string.' })
  @IsEmail({}, { message: 'O email informado não é válido.' })
  public email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'O NIF não pode estar vazio.' })
  @IsString({ message: 'O NIF deve ser uma string.' })
  public nif?: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  public password: string;
}

export class AuthRegisterInput {
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  public name: string;

  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  @IsString({ message: 'O email deve ser uma string.' })
  @IsEmail({}, { message: 'O email informado não é válido.' })
  public email: string;

  @IsNotEmpty({ message: 'O NIF não pode estar vazio.' })
  @IsString({ message: 'O NIF deve ser uma string.' })
  public nif: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  public password: string;

  @IsEnum(['client', 'provider'], {
    message: 'O usuário deve ser client ou provider',
  })
  public role: 'client' | 'provider';
}

export class AuthChangePasswordInput {
  @IsNotEmpty({ message: 'O OTP não pode estar vazio.' })
  @IsString({ message: 'O OTP deve ser uma string.' })
  @MinLength(6, { message: 'O OTP deve ter no mínimo 6 caracteres.' })
  public code: string;

  @IsNotEmpty({ message: 'A senha antiga não pode estar vazia.' })
  @IsString({ message: 'A senha antiga deve ser uma string.' })
  @MinLength(6, { message: 'A senha antiga deve ter no mínimo 6 caracteres.' })
  public oldPassword: string;

  @IsNotEmpty({ message: 'A nova senha não pode estar vazia.' })
  @IsString({ message: 'A nova senha deve ser uma string.' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
  public newPassword: string;
}

export class AuthActivateAccountInput {
  @IsNotEmpty({ message: 'O OTP não pode estar vazio.' })
  @IsString({ message: 'O OTP deve ser uma string.' })
  @MinLength(6, { message: 'O OTP deve ter no mínimo 6 caracteres.' })
  public code: string;
}
