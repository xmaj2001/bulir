import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { ServiceService } from '../services/service.service';
import ServiceRepository from '../repository/service.repo';
import FakeServiceRepository from '../repository/fake.service.repo';
import { JwtModule } from '@nestjs/jwt';
import UserRepository from '../../user/repository/user.repo';
import FakeUserRepository from '../../user/repository/fake.user.repo';

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
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
      ],
      imports: [JwtModule.register({ global: true })],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  it('Deve ser definido', () => {
    expect(controller).toBeDefined();
  });
});
