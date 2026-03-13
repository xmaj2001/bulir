import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class NifSignInInput {
  @ApiProperty({ example: "123456789LA042" })
  @IsString()
  @MinLength(9, { message: "NIF inválido" })
  @MaxLength(14, { message: "NIF inválido" })
  nif: string;

  @ApiProperty({ example: "Pass@1234" })
  @IsString()
  @IsNotEmpty({ message: "Password não pode estar vazia" })
  password: string;
}
