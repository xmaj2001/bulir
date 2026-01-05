import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import UserRepository from '../repository/user.repo';
import FakeUserRepository from '../repository/fake.user.repo';

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
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('O controlador deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('Deve listar todos os usuários', async () => {
    const users = await controller.getAll();
    expect(users.length).toBeGreaterThan(0);
  });

  it('Deve encontrar um usuário pelo email', async () => {
    const user = await controller.getByEmail('john.doe@example.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('john.doe@example.com');
  });

  it('Deve encontrar um usuário pelo NIF', async () => {
    const user = await controller.getByNif('987654321');
    expect(user).toBeDefined();
    expect(user.role).toBe('provider');
  });

  it('Deve encontrar um usuário pelo ID', async () => {
    const user = await controller.getById('1');
    expect(user).toBeDefined();
    expect(user.name).toBe('John Doe');
  });

  it('Deve lançar NotFoundException ao buscar usuário por ID inexistente', async () => {
    await expect(controller.getById('999')).rejects.toThrow(
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
    await expect(controller.deleteById('2')).resolves.toBeUndefined();
    await expect(controller.getById('2')).rejects.toThrow(
      'O usuário com id 2 não foi encontrado',
    );
  });

  it('Deve lançar NotFoundException ao deletar usuário inexistente', async () => {
    await expect(controller.deleteById('999')).rejects.toThrow(
      'O usuário com id 999 não foi encontrado',
    );
  });

  it('Deve atualizar o saldo do usuário', async () => {
    const updatedUser = await controller.updateUserBalance('1', {
      amount: 50,
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.balance).toBe(150);
  });

  it('Deve lançar NotFoundException ao atualizar saldo de usuário inexistente', async () => {
    await expect(
      controller.updateUserBalance('999', { amount: 50 }),
    ).rejects.toThrow('O usuário com id 999 não foi encontrado');
  });
});
