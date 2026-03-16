import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateBookingInput {
  @ApiProperty({ example: "service-uuid" })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: "O cliente tem alergia a latex", required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
