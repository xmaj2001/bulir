import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import UserEntity, {
  UserAcountStatus,
  UserRole,
} from 'src/modules/user/entities/user.entity';
import UserRepository from 'src/modules/user/repository/user.repo';

@Injectable()
export default class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToUserEntity(user: User): UserEntity {
    const userEntity = new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      nif: user.nif,
      role: user.role as UserRole,
      balance: user.balance,
      status: user.status as UserAcountStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    userEntity.setPassword(user.password);
    return userEntity;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        nif: user.nif,
        role: user.role,
        balance: user.balance,
        password: user.getPassword(),
        status: user.status,
      },
    });
    return this.mapToUserEntity(createdUser);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return this.mapToUserEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return this.mapToUserEntity(user);
  }

  async findByNif(nif: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { nif },
    });
    if (!user) return null;
    return this.mapToUserEntity(user);
  }

  async updateBalance(
    userId: string,
    amount: number,
    tx?: any,
  ): Promise<UserEntity | null> {
    const prisma = tx || this.prisma;
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    if (updatedUsers.count === 0) {
      return null;
    }
    return this.findById(userId);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        nif: user.nif,
        role: user.role,
        password: user.getPassword(),
        status: user.status,
      },
    });
    return this.mapToUserEntity(updatedUser);
  }

  async debitBalance(
    userId: string,
    amount: number,
    tx?: any,
  ): Promise<UserEntity | null> {
    const prisma = tx || this.prisma;
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: userId,
        balance: { gte: amount },
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
    if (updatedUsers.count === 0) {
      return null;
    }
    return this.findById(userId);
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
