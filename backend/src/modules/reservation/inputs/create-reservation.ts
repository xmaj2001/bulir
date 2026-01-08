import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationInput {
  @IsString({ message: 'O ID do serviço deve ser uma string' })
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório' })
  serviceId: string;
}
