import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import SessionRepository from '../repository/session.repo';
import FakeSessionRepository from '../repository/fake/fake.session';
import { PasswordHasher } from '../../../adapters/hasher/password-hasher.port';
import FakePasswordHasher from '../../../adapters/hasher/fake-hash';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: SessionRepository,
          useClass: FakeSessionRepository,
        },
        {
          provide: PasswordHasher,
          useClass: FakePasswordHasher,
        },
      ],
      imports: [UserModule, JwtModule.register({ global: true })],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Deve ser definido', () => {
    expect(controller).toBeDefined();
  });
});
