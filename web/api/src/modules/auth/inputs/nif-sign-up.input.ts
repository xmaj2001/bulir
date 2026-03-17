import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
} from "class-validator";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export class NifSignUpInput {
  @ApiProperty({ example: "123456789LA042" })
  @IsString()
  @MinLength(9, { message: "NIF inválido" })
  @MaxLength(14, { message: "NIF inválido" })
  nif: string;

  @ApiProperty({ example: "Xavier Silva" })
  @IsString()
  @MinLength(2, { message: "Nome muito curto" })
  @MaxLength(100, { message: "Nome muito longo" })
  name: string;

  @ApiProperty({ example: `${Role.USER}` })
  @IsString()
  @IsEnum(Role, { message: `Role deve ser ${Role.USER} ou ${Role.ADMIN}` })
  role: Role;

  @ApiProperty({
    example: "Pass@1234",
    description: "Mín. 8 chars, 1 maiúscula, 1 número, 1 especial",
  })
  @IsString()
  @MinLength(8, { message: "Password deve ter pelo menos 8 caracteres" })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: "Password deve ter 1 maiúscula, 1 número e 1 caracter especial",
  })
  password: string;
}
