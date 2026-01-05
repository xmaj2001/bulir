import { Injectable } from '@nestjs/common';
import UserRepository from './user.repo';
import UserEntity, { UserRole } from '../entities/user.entity';

@Injectable()
export default class FakeUserRepository implements UserRepository {
  private users: UserEntity[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      nif: '123456789',
      role: UserRole.CLIENT,
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity,
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      nif: '987654321',
      role: UserRole.PROVIDER,
      balance: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity,
  ];

  async create(user: UserEntity) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.users.push(user);
    return user;
  }

  async findAll() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.users;
  }

  async findById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByNif(nif: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.users.find((user) => user.nif === nif) ?? null;
  }

  async findByEmail(email: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.users.find((user) => user.email === email) ?? null;
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.users = this.users.filter((user) => user.id !== id);
  }

  async updateBalance(
    userId: string,
    amount: number,
  ): Promise<UserEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return null;
    }
    user.balance += amount;
    user.updatedAt = new Date();
    return user;
  }
}
