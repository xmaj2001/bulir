import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserInput {
  @ApiProperty({
    example: "Xavier Silva",
    description: "Nome do utilizador",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Nome deve ser uma string" })
  @MinLength(2, { message: "Nome deve ter pelo menos 2 caracteres" })
  name?: string;

  @ApiProperty({
    example: "123456789",
    description: "NIF do utilizador",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "NIF deve ser uma string" })
  @MinLength(9, { message: "NIF deve ter pelo menos 9 caracteres" })
  nif?: string;

  @ApiProperty({
    example: "https://cdn.example.com/avatar.jpg",
    description: "URL do avatar",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Avatar URL deve ser uma string" })
  @IsUrl({}, { message: "Avatar URL deve ser uma URL válida" })
  avatarUrl?: string;
}
