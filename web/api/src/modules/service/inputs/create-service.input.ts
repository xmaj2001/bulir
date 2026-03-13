import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
  IsBoolean,
} from "class-validator";

export class CreateServiceInput {
  @ApiProperty({ example: "Limpeza de Sofás" })
  @IsString({ message: "O nome deve ser uma string" })
  @IsNotEmpty({ message: "O nome é obrigatório" })
  name: string;

  @ApiProperty({ example: "Limpeza profunda de sofás a seco" })
  @IsString({ message: "A descrição deve ser uma string" })
  @IsNotEmpty({ message: "A descrição é obrigatória" })
  description: string;

  @ApiProperty({ example: 50.0 })
  @IsNumber({}, { message: "O preço deve ser um número" })
  @IsPositive({ message: "O preço deve ser positivo" })
  @Min(0, { message: "O preço deve ser maior ou igual a 0" })
  price: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: "O status deve ser um booleano" })
  isActive?: boolean;
}
