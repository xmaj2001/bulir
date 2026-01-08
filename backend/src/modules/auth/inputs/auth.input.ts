import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    required: false,
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  public email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'O NIF não pode estar vazio.' })
  @IsString({ message: 'O NIF deve ser uma string.' })
  @ApiProperty({
    required: false,
    description: 'NIF do usuário',
    example: '123456789',
  })
  public nif?: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password123',
  })
  public password: string;
}

export class AuthRegisterInput {
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  public name: string;

  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  @IsString({ message: 'O email deve ser uma string.' })
  @IsEmail({}, { message: 'O email informado não é válido.' })
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  public email: string;

  @IsNotEmpty({ message: 'O NIF não pode estar vazio.' })
  @IsString({ message: 'O NIF deve ser uma string.' })
  @ApiProperty({
    description: 'NIF do usuário',
    example: '123456789',
  })
  public nif: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password123',
  })
  public password: string;

  @IsEnum(['client', 'provider'], {
    message: 'O usuário deve ser client ou provider',
  })
  @ApiProperty({
    description: 'Tipo de usuário',
    example: 'client',
    enum: ['client', 'provider'],
  })
  public role: 'client' | 'provider';
}

export class AuthChangePasswordInput {
  @IsNotEmpty({ message: 'O OTP não pode estar vazio.' })
  @IsString({ message: 'O OTP deve ser uma string.' })
  @MinLength(6, { message: 'O OTP deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'Código OTP para alteração de senha',
    example: '123456',
  })
  public code: string;

  @IsNotEmpty({ message: 'A senha antiga não pode estar vazia.' })
  @IsString({ message: 'A senha antiga deve ser uma string.' })
  @MinLength(6, { message: 'A senha antiga deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'Senha antiga do usuário',
    example: 'oldpassword123',
  })
  public oldPassword: string;

  @IsNotEmpty({ message: 'A nova senha não pode estar vazia.' })
  @IsString({ message: 'A nova senha deve ser uma string.' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'newpassword123',
  })
  public newPassword: string;
}

export class AuthActivateAccountInput {
  @IsNotEmpty({ message: 'O OTP não pode estar vazio.' })
  @IsString({ message: 'O OTP deve ser uma string.' })
  @MinLength(6, { message: 'O OTP deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'Código OTP para ativação de conta',
    example: '123456',
  })
  public code: string;
}
