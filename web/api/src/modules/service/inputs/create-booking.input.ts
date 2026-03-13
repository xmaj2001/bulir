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

  @ApiProperty({ example: "Please be on time", required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: "2026-03-20T10:00:00Z", required: false })
  @IsDateString()
  @IsOptional()
  scheduledAt?: Date;
}
