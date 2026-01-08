import { Injectable, NotFoundException } from '@nestjs/common';
import UserRepository from '../repository/user.repo';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async updateBalance(id: string, amount: number) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`O usuário com id ${id} não foi encontrado`);
    }

    if (user.balance + amount < 0) {
      throw new NotFoundException(`Saldo insuficiente para esta operação`);
    }

    const result = await this.repo.updateBalance(id, amount);
    if (!result) {
      throw new Error('Erro ao atualizar o saldo do usuário');
    }
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      nif: result.nif,
      role: result.role,
      balance: result.balance,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async me(userId: string) {
    const result = await this.repo.me(userId);
    if (!result) {
      throw new NotFoundException(
        `O usuário com id ${userId} não foi encontrado`,
      );
    }
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      nif: result.nif,
      role: result.role,
      balance: result.balance,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findById(id: string) {
    const result = await this.repo.findById(id);
    if (!result) {
      throw new NotFoundException(`O usuário com id ${id} não foi encontrado`);
    }
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      nif: result.nif,
      role: result.role,
      balance: result.balance,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByNif(nif: string) {
    const result = await this.repo.findByNif(nif);
    if (!result) {
      throw new NotFoundException(
        `O usuário com NIF ${nif} não foi encontrado`,
      );
    }
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      nif: result.nif,
      role: result.role,
      balance: result.balance,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findByEmail(email: string) {
    const result = await this.repo.findByEmail(email);
    if (!result) {
      throw new NotFoundException(
        `O usuário com email ${email} não foi encontrado`,
      );
    }
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      nif: result.nif,
      role: result.role,
      balance: result.balance,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`O usuário com id ${id} não foi encontrado`);
    }
    return this.repo.delete(user.id);
  }
}
