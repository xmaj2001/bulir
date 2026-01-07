import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import ReservationRepository from '../repository/reservation.repo';
import ServiceRepository from '../../service/repository/service.repo';
import UserRepository from '../../user/repository/user.repo';
import ReservationEntity from '../entities/reservation.entity';
import { CreateReservationInput } from '../inputs/create-reservation';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ReservationService {
  constructor(
    private readonly repo: ReservationRepository,
    private readonly serviceRepo: ServiceRepository,
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(input: CreateReservationInput, clientId: string) {
    const service = await this.serviceRepo.findById(input.serviceId);
    if (!service) throw new NotFoundException('Serviço não encontrado');

    const client = await this.userRepo.findById(clientId);
    if (!client) throw new NotFoundException('Cliente não encontrado');

    if (service.providerId === client.id)
      throw new ConflictException('Não podes reservar o teu próprio serviço');

    if (service.price > client.balance)
      throw new ConflictException(
        'Saldo insuficiente para reservar este serviço',
      );
    const createdReservation = await this.prisma.$transaction(async (tx) => {
      const updatedClient = await this.userRepo.debitBalance(
        client.id,
        service.price,
        tx,
      );
      if (!updatedClient) {
        throw new ConflictException(
          'Falha ao debitar o saldo. Saldo insuficiente.',
        );
      }

      const reservation = new ReservationEntity({
        serviceId: service.id,
        providerId: service.providerId,
        clientId: client.id,
        price: service.price,
      });

      const createdReservation = await this.repo.create(reservation, tx);
      if (!createdReservation) throw new Error('Erro ao criar a reserva');

      return createdReservation;
    });
    return createdReservation;
  }

  async findById(id: string) {
    const reservation = await this.repo.findById(id);
    if (!reservation) throw new NotFoundException('Reserva não encontrada');
    return reservation;
  }

  async findByClientId(clientId: string) {
    const exitClient = await this.userRepo.findById(clientId);
    if (!exitClient) throw new NotFoundException('Cliente não encontrado');

    const reservations = await this.repo.findByClientId(clientId);
    return reservations;
  }

  async cancel(reservationId: string, userId: string) {
    const reservation = await this.repo.findById(reservationId);
    if (!reservation) throw new NotFoundException('Reserva não encontrada');

    const exitClient = await this.userRepo.findById(userId);
    if (!exitClient) throw new NotFoundException('Usuário não encontrado');

    if (
      reservation.clientId !== exitClient.id &&
      reservation.providerId !== exitClient.id
    ) {
      throw new UnauthorizedException(
        'Não tens permissão para cancelar esta reserva',
      );
    }

    await this.repo.cancel(reservationId);
  }
}
