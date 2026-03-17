import { ApiProperty } from "@nestjs/swagger";

export function ApiSuccessResponse<T>(DataClass: new () => T) {
  class SuccessEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => DataClass })
    data: T;

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }

  return SuccessEnvelope;
}

export function ApiSuccessArrayResponse<T>(DataClass: new () => T) {
  class SuccessArrayEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => [DataClass] })
    data: T[];

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }

  return SuccessArrayEnvelope;
}

export class ApiErrorDetailResponse {
  @ApiProperty({ example: 404 })
  code: number;

  @ApiProperty({ example: "Recurso não encontrado" })
  message: string;
}

export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ type: () => ApiErrorDetailResponse })
  error: ApiErrorDetailResponse;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  ts: string;

  @ApiProperty({ example: "/wallet/me" })
  path: string;
}
