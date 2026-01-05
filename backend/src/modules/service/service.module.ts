import { Module } from '@nestjs/common';
import { ServiceService } from './services/service.service';
import { ServiceController } from './service.controller';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
