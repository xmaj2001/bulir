import { Module } from '@nestjs/common';
import { ServiceService } from './services/service.service';
import { ServiceController } from './controllers/service.controller';
import ServiceRepository from './repository/service.repo';
import FakeServiceRepository from './repository/fake.service.repo';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ServiceController],
  providers: [
    ServiceService,
    {
      provide: ServiceRepository,
      useClass: FakeServiceRepository,
    },
  ],
  imports: [UserModule],
  exports: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
