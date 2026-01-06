import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import SessionRepository from '../repository/session.repo';
import FakeSessionRepository from '../repository/fake/fake.session';
import { PasswordHasher } from '../../../adapters/hasher/password-hasher.port';
import FakePasswordHasher from '../../../adapters/hasher/fake-hash';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthRegisterInput } from '../inputs/auth.input';
import { UserRole } from '../../user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      imports: [
        UserModule,
        JwtModule.register({
          global: true,
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve registrar um novo usuário', async () => {
    const registerInput: AuthRegisterInput = {
      name: 'Usuário Teste',
      email: 'user@test.com',
      nif: '1234567890',
      password: 'password',
      role: UserRole.PROVIDER,
    };
    const result = await service.registerUser(registerInput);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe(registerInput.name);
    expect(result.email).toBe(registerInput.email);
    expect(result.nif).toBe(registerInput.nif);
    expect(result.role).toBe(registerInput.role);
  });

  it('não deve registrar um usuário com email duplicado', async () => {
    const registerInput: AuthRegisterInput = {
      name: 'Usuário Teste',
      email: 'user@test.com',
      nif: '1234567890',
      password: 'password',
      role: UserRole.PROVIDER,
    };
    await service.registerUser(registerInput);

    await expect(service.registerUser(registerInput)).rejects.toThrow(
      `O email ${registerInput.email} já está em uso`,
    );
  });

  it('não deve registrar um usuário com NIF duplicado', async () => {
    const registerInput1: AuthRegisterInput = {
      name: 'Usuário Teste 1',
      email: 'user1@test.com',
      nif: '1234567890d',
      password: 'password1',
      role: UserRole.PROVIDER,
    };
    const registerInput2: AuthRegisterInput = {
      name: 'Usuário Teste 2',
      email: 'user2@test.com',
      nif: '1234567890d',
      password: 'password2',
      role: UserRole.PROVIDER,
    };
    await service.registerUser(registerInput1);

    await expect(service.registerUser(registerInput2)).rejects.toThrow(
      `O NIF ${registerInput2.nif} já está em uso`,
    );
  });

  it('deve fazer login com email', async () => {
    const registerInput: AuthRegisterInput = {
      name: 'Usuário Teste',
      email: 'lucasz@x.com',
      nif: '9876543210',
      password: 'password',
      role: UserRole.PROVIDER,
    };
    await service.registerUser(registerInput);

    const result = await service.login(
      { email: registerInput.email, password: registerInput.password },
      '192.168.0.1',
      'Mozilla/5.0',
    );
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
