import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export function ApiSuccessResponse<T>(DataClass: new () => T) {
  const className = `${DataClass.name}Envelope`;

  @Expose()
  class SuccessEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => DataClass })
    @Expose()
    data: T;

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }
  Object.defineProperty(SuccessEnvelope, "name", { value: className });
  return SuccessEnvelope;
}

export function ApiSuccessArrayResponse<T>(DataClass: new () => T) {
  const className = `${DataClass.name}ArrayEnvelope`;

  class SuccessArrayEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => [DataClass] })
    data: T[];

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }
  Object.defineProperty(SuccessArrayEnvelope, "name", { value: className });
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

export class RateLimitResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    example: {
      code: 429,
      message: "Demasiadas tentativas, por favor tenta novamente mais tarde.",
    },
  })
  error: ApiErrorDetailResponse;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  ts: string;

  @ApiProperty({ example: "/auth/sign-in/email" })
  path: string;
}
