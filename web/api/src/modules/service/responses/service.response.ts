import { ApiProperty } from "@nestjs/swagger";

export class ServiceResponse {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "Corte de cabelo" })
  name: string;

  @ApiProperty({ example: "Um corte de cabelo moderno e elegante" })
  description: string;

  @ApiProperty({ example: 50.0 })
  price: number;

  @ApiProperty({ example: "https://example.com/image.jpg" })
  imageUrl?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001" })
  providerId: string;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  updatedAt: Date;
}

export class PaginationMetaResponse {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class PaginatedServicesResponse {
  @ApiProperty({ type: [ServiceResponse] })
  items: ServiceResponse[];

  @ApiProperty({ type: () => PaginationMetaResponse })
  meta: PaginationMetaResponse;
}
