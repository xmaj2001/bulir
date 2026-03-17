import { Injectable, NotFoundException } from "@nestjs/common";
import { ServiceRepository } from "../repository/service.repo";
import { Logger } from "@nestjs/common";

@Injectable()
export class GetServiceService {
  private readonly logger = new Logger(GetServiceService.name);
  constructor(private readonly serviceRepo: ServiceRepository) {}

  async findAllActive() {
    const services = await this.serviceRepo.findAllActive();
    return services.map((s) => s.publicData());
  }

  async findMine(providerId: string) {
    const services = await this.serviceRepo.findByProviderId(providerId);
    return services.map((s) => s.publicData());
  }

  async findOne(id: string) {
    const service = await this.serviceRepo.findById(id);
    if (!service) {
      this.logger.warn(`Serviço ${id} não encontrado`);
      throw new NotFoundException("O serviço não foi encontrado");
    }
    return service.publicData();
  }
}
