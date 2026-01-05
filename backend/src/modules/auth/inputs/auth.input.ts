import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Min,
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
  @Min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
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
  @Min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  public password: string;

  @IsEnum(['client', 'provider'], {
    message: 'O usuário deve ser client ou provider',
  })
  public role: 'client' | 'provider';
}

export class AuthRefreshInput {
  @IsNotEmpty({ message: 'O token de refresh não pode estar vazio.' })
  @IsString({ message: 'O token de refresh deve ser uma string.' })
  public refreshToken: string;
}

export class AuthLogoutInput {
  @IsNotEmpty({ message: 'O token de refresh não pode estar vazio.' })
  @IsString({ message: 'O token de refresh deve ser uma string.' })
  public refreshToken: string;
}

export class AuthRevokeSessionsInput {
  @IsNotEmpty({ message: 'O ID do usuário não pode estar vazio.' })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  public userId: string;
}
