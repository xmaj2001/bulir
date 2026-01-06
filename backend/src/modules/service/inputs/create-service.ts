import { Type } from 'class-transformer';
import {
  IsNegative,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateServiceInput {
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  @IsString({ message: 'O nome do serviço deve ser uma string' })
  @MaxLength(100, {
    message: 'O nome do serviço deve ter no máximo 100 caracteres',
  })
  @MinLength(3, {
    message: 'O nome do serviço deve ter no mínimo 3 caracteres',
  })
  name: string;

  @IsNotEmpty({ message: 'A descrição do serviço é obrigatória' })
  @IsString({ message: 'A descrição do serviço deve ser uma string' })
  @MaxLength(500, {
    message: 'A descrição do serviço deve ter no máximo 500 caracteres',
  })
  @MinLength(10, {
    message: 'A descrição do serviço deve ter no mínimo 10 caracteres',
  })
  description: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'O preço do serviço é obrigatório' })
  @Max(100000, { message: 'O preço do serviço deve ser no máximo 100000' })
  @IsNegative({ message: 'O preço do serviço deve ser um número positivo' })
  price: number;

  @IsNotEmpty({ message: 'O ID do provedor é obrigatório' })
  @IsString({ message: 'O ID do provedor deve ser uma string' })
  providerId: string;
}
