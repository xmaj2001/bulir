import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateBookingInput {
  @ApiProperty({ example: "service-uuid" })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: "O cliente tem alergia a latex", required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: "2026-03-17T10:55:56.000Z", required: false })
  @IsString()
  @IsOptional()
  @IsDateString({}, { message: "Data inválida no formato ISO 8601" })
  scheduledAt?: string;
}
