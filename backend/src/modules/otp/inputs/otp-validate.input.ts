import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OtpValidateInput {
  @IsNotEmpty({ message: 'O código OTP não pode estar vazio.' })
  @IsString({ message: 'O código OTP deve ser uma string.' })
  @MinLength(6, { message: 'O código OTP deve ter no mínimo 6 caracteres.' })
  @ApiProperty({
    description: 'O código OTP a ser validado.',
    example: '123456',
  })
  public code: string;

  @ApiProperty({
    description: 'O propósito do OTP.',
    example: 'VERIFY_EMAIL',
    enum: ['CHANGE_PASSWORD', 'VERIFY_EMAIL'],
  })
  @IsEnum(['CHANGE_PASSWORD', 'VERIFY_EMAIL'], {
    message: 'O propósito do OTP é inválido.',
  })
  public purpose: 'CHANGE_PASSWORD' | 'VERIFY_EMAIL';
}
