import { Module } from '@nestjs/common';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './services/reservation.service';
import FakeReservationRepository from './repository/fake/fake-reservation';
import ReservationRepository from './repository/reservation.repo';
import { UserModule } from '../user/user.module';
import { ServiceModule } from '../service/service.module';
import PrismaReservationRepository from './repository/prisma/prisma.reservation.repo';

@Module({
  controllers: [ReservationController],
  providers: [
    ReservationService,
    {
      provide: ReservationRepository,
      useClass: PrismaReservationRepository,
      // useClass: FakeReservationRepository,
    },
  ],
  imports: [UserModule, ServiceModule],
})
export class ReservationModule {}
