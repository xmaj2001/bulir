import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class WebhookPayloadInput {
  @ApiProperty({ example: 'judge0' })
  @IsString() @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: 'submission.completed' })
  @IsString() @IsNotEmpty()
  event: string;

  @ApiProperty({ type: Object })
  @IsObject()
  data: Record<string, unknown>;
}
