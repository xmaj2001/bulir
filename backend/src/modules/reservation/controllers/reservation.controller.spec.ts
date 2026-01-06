import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from '../services/reservation.service';
import ReservationRepository from '../repository/reservation.repo';
import FakeReservationRepository from '../repository/fake/fake-reservation';
import ServiceRepository from '../../service/repository/service.repo';
import FakeServiceRepository from '../../service/repository/fake.service.repo';
import UserRepository from '../../user/repository/user.repo';
import FakeUserRepository from '../../user/repository/fake.user.repo';
import { JwtModule } from '@nestjs/jwt';

describe('ReservationController', () => {
  let controller: ReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        ReservationService,
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
      imports: [JwtModule.register({ global: true })],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
