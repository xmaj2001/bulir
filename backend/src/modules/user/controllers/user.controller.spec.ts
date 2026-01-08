import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import UserRepository from '../repository/user.repo';
import FakeUserRepository from '../repository/fake.user.repo';
import { JwtModule } from '@nestjs/jwt';
import { RequestWithUser } from 'src/shared/http/user-request';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
      ],
      imports: [JwtModule.register({ global: true })],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('O controlador deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('Deve encontrar um usuário pelo email', async () => {
    const user = await controller.getByEmail('max@x.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('max@x.com');
  });

  it('Deve encontrar um usuário pelo NIF', async () => {
    const user = await controller.getByNif('987654321');
    expect(user).toBeDefined();
    expect(user.role).toBe('provider');
  });

  it('Deve encontrar um usuário pelo ID', async () => {
    const req = { user: { sub: '1' } } as RequestWithUser;
    const user = await controller.getById(req);
    expect(user).toBeDefined();
    expect(user.name).toBe('Max Mustermann');
  });

  it('Deve lançar NotFoundException ao buscar usuário por ID inexistente', async () => {
    const req = { user: { sub: '999' } } as RequestWithUser;
    await expect(controller.getById(req)).rejects.toThrow(
      'O usuário com id 999 não foi encontrado',
    );
  });

  it('Deve lançar NotFoundException ao buscar usuário por NIF inexistente', async () => {
    await expect(controller.getByNif('6464')).rejects.toThrow(
      'O usuário com NIF 6464 não foi encontrado',
    );
  });

  it('Deve lançar NotFoundException ao buscar usuário por Email inexistente', async () => {
    await expect(controller.getByEmail('email@x.com')).rejects.toThrow(
      'O usuário com email email@x.com não foi encontrado',
    );
  });

  it('Deve deletar um usuário existente', async () => {
    await expect(
      controller.deleteById({ user: { sub: '2' } } as RequestWithUser),
    ).resolves.toBeUndefined();
    const req = { user: { sub: '2' } } as RequestWithUser;
    await expect(controller.getById(req)).rejects.toThrow(
      'O usuário com id 2 não foi encontrado',
    );
  });

  it('Deve lançar NotFoundException ao deletar usuário inexistente', async () => {
    await expect(
      controller.deleteById({ user: { sub: '999' } } as RequestWithUser),
    ).rejects.toThrow('O usuário com id 999 não foi encontrado');
  });

  it('Deve atualizar o saldo do usuário', async () => {
    const updatedUser = await controller.updateBalance(
      {
        amount: 50,
      },
      { user: { sub: '1' } } as RequestWithUser,
    );
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.balance).toBe(10050);
  });

  it('Deve lançar NotFoundException ao atualizar saldo de usuário inexistente', async () => {
    await expect(
      controller.updateBalance({ amount: 50 }, {
        user: { sub: '999' },
      } as RequestWithUser),
    ).rejects.toThrow('O usuário com id 999 não foi encontrado');
  });
});
