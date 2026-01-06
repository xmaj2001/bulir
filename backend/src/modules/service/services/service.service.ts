import { Injectable, NotFoundException } from '@nestjs/common';
import ServiceRepository from '../repository/service.repo';
import { CreateServiceInput } from '../inputs/create-service';
import UserRepository from 'src/modules/user/repository/user.repo';
import ServiceEntity from '../entities/service.entity';
import { UpdateServiceInput } from '../inputs/upadate-service';

@Injectable()
export class ServiceService {
  constructor(
    private readonly repo: ServiceRepository,
    private readonly user: UserRepository,
  ) {}

  async create(input: CreateServiceInput) {
    const provider = await this.user.findById(input.providerId);
    if (!provider) {
      throw new NotFoundException(`O prestador não foi encontrado`);
    }
    const newService = new ServiceEntity(
      input.name,
      input.description,
      input.price,
      input.providerId,
    );
    return await this.repo.create(newService);
  }

  async findById(id: string) {
    const service = await this.repo.findById(id);
    if (!service) {
      throw new NotFoundException(`O serviço não foi encontrado`);
    }
    return service;
  }

  async findbyProviderId(providerId: string) {
    const provider = await this.user.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`O prestador não foi encontrado`);
    }
    return await this.repo.findByProviderId(providerId);
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async update(input: UpdateServiceInput) {
    const provider = await this.user.findById(input.providerId);
    if (!provider) {
      throw new NotFoundException(`O prestador não foi encontrado`);
    }
    const existingService = await this.repo.findById(input.id);
    if (!existingService) {
      throw new NotFoundException(`O serviço não foi encontrado`);
    }
    existingService.updateDetails(input.name, input.description, input.price);
    return await this.repo.update(existingService);
  }

  async delete(id: string) {
    const existingService = await this.repo.findById(id);
    if (!existingService) {
      throw new NotFoundException(`O serviço não foi encontrado`);
    }
    return this.repo.delete(existingService.id);
  }
}
