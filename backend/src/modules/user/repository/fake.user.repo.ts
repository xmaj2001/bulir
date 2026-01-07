import { Injectable } from '@nestjs/common';
import UserRepository from './user.repo';
import UserEntity, { UserRole } from '../entities/user.entity';

@Injectable()
export default class FakeUserRepository implements UserRepository {
  private users: UserEntity[] = [
    new UserEntity({
      id: '1',
      name: 'Max Mustermann',
      email: 'max@x.com',
      nif: '123456789',
      role: UserRole.CLIENT,
      balance: 8000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new UserEntity({
      id: '2',
      name: 'Lucas Schmidt',
      email: 'lucas@x.com',
      nif: '987654321',
      role: UserRole.PROVIDER,
      balance: 2000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    new UserEntity({
      id: '3',
      name: 'Provider One',
      email: 'provider1@x.com',
      nif: '111222333',
      role: UserRole.PROVIDER,
      balance: 3000,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
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

  async update(user: UserEntity): Promise<UserEntity> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users[index] = user;
    return user;
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

  async debitBalance(
    userId: string,
    amount: number,
  ): Promise<UserEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return null;
    }
    user.balance = amount;
    user.updatedAt = new Date();
    return user;
  }
}
