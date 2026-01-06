import { Module } from '@nestjs/common';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './services/reservation.service';
import FakeServiceRepository from '../service/repository/fake.service.repo';
import ServiceRepository from '../service/repository/service.repo';
import FakeUserRepository from '../user/repository/fake.user.repo';
import UserRepository from '../user/repository/user.repo';
import FakeReservationRepository from './repository/fake/fake-reservation';
import ReservationRepository from './repository/reservation.repo';

@Module({
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
})
export class ReservationModule {}
