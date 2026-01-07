import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import UserEntity, {
  UserAcountStatus,
  UserRole,
} from 'src/modules/user/entities/user.entity';
import UserRepository from 'src/modules/user/repository/user.repo';

@Injectable()
export default class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    const createdUserEntity = new UserEntity({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      nif: createdUser.nif,
      role: createdUser.role as UserRole,
      balance: createdUser.balance,
      status: createdUser.status as UserAcountStatus,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
    createdUserEntity.setPassword(createdUser.password);
    return createdUserEntity;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
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

  async findById(id: string, tx?: any): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
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

  async findByNif(nif: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { nif },
    });
    if (!user) return null;
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
        balance: amount,
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
    const updatedUserEntity = new UserEntity({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      nif: updatedUser.nif,
      role: updatedUser.role as UserRole,
      balance: updatedUser.balance,
      status: updatedUser.status as UserAcountStatus,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
    updatedUserEntity.setPassword(updatedUser.password);
    return updatedUserEntity;
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
