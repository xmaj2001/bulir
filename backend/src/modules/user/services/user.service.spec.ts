import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import UserRepository from '../repository/user.repo';
import FakeUserRepository from '../repository/fake.user.repo';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useClass: FakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('Deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Deve encontrar um usuário pelo ID', async () => {
    const user = await service.findById('1');
    expect(user).toBeDefined();
    expect(user.name).toBe('Max Mustermann');
  });

  it('Deve lançar NotFoundException ao buscar usuário por ID inexistente', async () => {
    await expect(service.findById('999')).rejects.toThrow(
      'O usuário com id 999 não foi encontrado',
    );
  });

  it('Deve encontrar um usuário pelo NIF', async () => {
    const user = await service.findByNif('987654321');
    expect(user).toBeDefined();
    expect(user.role).toBe('provider');
  });

  it('Deve lançar NotFoundException ao buscar usuário por NIF inexistente', async () => {
    await expect(service.findByNif('00000000000')).rejects.toThrow(
      'O usuário com NIF 00000000000 não foi encontrado',
    );
  });

  it('Deve encontrar um usuário pelo email', async () => {
    const user = await service.findByEmail('max@x.com');
    expect(user).toBeDefined();
    expect(user.email).toBe('max@x.com');
  });

  it('Deve lançar NotFoundException ao buscar usuário por email inexistente', async () => {
    await expect(
      service.findByEmail('nonexistent@example.com'),
    ).rejects.toThrow(
      'O usuário com email nonexistent@example.com não foi encontrado',
    );
  });

  it('Deve atualizar o saldo do usuário', async () => {
    const updatedUser = await service.updateBalance('1', 50);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.balance).toBe(10050);
  });

  it('Deve lançar NotFoundException ao atualizar saldo de usuário inexistente', async () => {
    await expect(service.updateBalance('999', 50)).rejects.toThrow(
      'O usuário com id 999 não foi encontrado',
    );
  });

  it('Deve deletar um usuário existente', async () => {
    await expect(service.delete('2')).resolves.toBeUndefined();
    await expect(service.findById('2')).rejects.toThrow(
      'O usuário com id 2 não foi encontrado',
    );
  });

  it('Deve lançar NotFoundException ao deletar usuário inexistente', async () => {
    await expect(service.delete('999')).rejects.toThrow(
      'O usuário com id 999 não foi encontrado',
    );
  });
});
