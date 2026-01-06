import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { ServiceService } from '../services/service.service';
import ServiceRepository from '../repository/service.repo';
import { UserModule } from '../../user/user.module';
import FakeServiceRepository from '../repository/fake.service.repo';
import { JwtModule } from '@nestjs/jwt';

describe('ServiceController', () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        ServiceService,
        {
          provide: ServiceRepository,
          useClass: FakeServiceRepository,
        },
      ],
      imports: [UserModule, JwtModule.register({ global: true })],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  it('Deve ser definido', () => {
    expect(controller).toBeDefined();
  });
});
