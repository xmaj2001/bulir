import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import ReservationRepository from '../repository/reservation.repo';
import FakeReservationRepository from '../repository/fake/fake-reservation';
import ServiceRepository from '../../service/repository/service.repo';
import FakeServiceRepository from '../../service/repository/fake.service.repo';
import UserRepository from '../../user/repository/user.repo';
import FakeUserRepository from '../../user/repository/fake.user.repo';
import { PrismaService } from 'nestjs-prisma';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        PrismaService,
        {
          provide: ReservationRepository,
          useClass: FakeReservationRepository,
        },
        {
          provide: ServiceRepository,
          useClass: FakeServiceRepository,
        },
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('Deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('Deve criar uma reserva', async () => {
    const reservation = await service.create(
      {
        serviceId: '2',
      },
      '1',
    );

    expect(reservation).toHaveProperty('id');
    expect(reservation.serviceId).toBe('2');
    expect(reservation.clientId).toBe('1');
    expect(reservation.providerId).toBe('2');
    expect(reservation.status).toBe('confirmed');
  });

  it('Deve cancelar uma reserva', async () => {
    const reservation = await service.create(
      {
        serviceId: '2',
      },
      '1',
    );

    await service.cancel(reservation.id, reservation.clientId);
    const canceledReservation = await service.findById(reservation.id);
    expect(canceledReservation).toBeDefined();
    expect(canceledReservation.status).toBe('canceled');
    expect(canceledReservation.canceledAt).toBeInstanceOf(Date);
  });

  it('Deve buscar uma reserva por ID', async () => {
    const reservation = await service.create(
      {
        serviceId: '2',
      },
      '1',
    );

    const foundReservation = await service.findById(reservation.id);
    expect(foundReservation).toBeDefined();
    expect(foundReservation.id).toBe(reservation.id);
  });

  it('Deve buscar reservas por ID do cliente', async () => {
    await service.create(
      {
        serviceId: '2',
      },
      '1',
    );

    await service.create(
      {
        serviceId: '3',
      },
      '1',
    );

    const reservations = await service.findByClientId('1');
    expect(reservations).toBeDefined();
    expect(reservations.length).toBe(2);
    expect(reservations[0].clientId).toBe('1');
    expect(reservations[1].clientId).toBe('1');
  });

  it('Deve lançar erro ao tentar reservar o próprio serviço', async () => {
    await expect(
      service.create(
        {
          serviceId: '2',
        },
        '2',
      ),
    ).rejects.toThrow('Não podes reservar o teu próprio serviço');
  });

  it('Deve lançar erro ao tentar reservar com saldo insuficiente', async () => {
    await expect(
      service.create(
        {
          serviceId: '2',
        },
        '4',
      ),
    ).rejects.toThrow('Saldo insuficiente para reservar este serviço');
  });

  it('Deve lançar erro ao buscar reserva inexistente', async () => {
    await expect(service.findById('inexistente')).rejects.toThrow(
      'Reserva não encontrada',
    );
  });

  it('Deve lançar erro ao buscar reservas de cliente inexistente', async () => {
    await expect(service.findByClientId('inexistente')).rejects.toThrow(
      'Cliente não encontrado',
    );
  });

  it('Deve lançar erro ao cancelar reserva por usuário não autorizado', async () => {
    const reservation = await service.create(
      {
        serviceId: '2',
      },
      '1',
    );

    await expect(service.cancel(reservation.id, '3')).rejects.toThrow(
      'Não tens permissão para cancelar esta reserva',
    );
  });

  it('Deve lançar erro ao cancelar reserva inexistente', async () => {
    await expect(service.cancel('inexistente', '2')).rejects.toThrow(
      'Reserva não encontrada',
    );
  });
});
