import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CancelBookingInput {
  @ApiProperty({ example: "Motivo do cancelamento", required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
