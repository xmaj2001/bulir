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
    return this.repo.updateBalance(id, amount);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const result = await this.repo.findById(id);
    if (!result) {
      throw new NotFoundException(`O usuário com id ${id} não foi encontrado`);
    }
    return result;
  }

  async findByNif(nif: string) {
    const result = await this.repo.findByNif(nif);
    if (!result) {
      throw new NotFoundException(
        `O usuário com NIF ${nif} não foi encontrado`,
      );
    }
    return result;
  }

  async findByEmail(email: string) {
    const result = await this.repo.findByEmail(email);
    if (!result) {
      throw new NotFoundException(
        `O usuário com email ${email} não foi encontrado`,
      );
    }
    return result;
  }

  async delete(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`O usuário com id ${id} não foi encontrado`);
    }
    return this.repo.delete(user.id);
  }
}
