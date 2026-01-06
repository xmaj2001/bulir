import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationInput {
  @IsString({ message: 'O ID do serviço deve ser uma string' })
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório' })
  serviceId: string;

  @IsString({ message: 'O ID do cliente deve ser uma string' })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório' })
  clientId: string;
}
