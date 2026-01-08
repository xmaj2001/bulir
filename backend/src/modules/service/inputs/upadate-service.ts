import { IsNotEmpty, IsString } from 'class-validator';
import { CreateServiceInput } from './create-service';

export class UpdateServiceInput extends CreateServiceInput {
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório' })
  @IsString({ message: 'O ID do serviço deve ser uma string' })
  id: string;
}
