import { Injectable, NotFoundException } from "@nestjs/common";
import { ServiceRepository } from "../repository/service.repo";
import { ServiceEntity } from "../entities/service.entity";
import { CreateServiceInput } from "../inputs/create-service.input";
import { UserRepository } from "src/modules/user/repository/user.repo";
import { Logger } from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { ServiceCreatedEvent } from "../events/service-created.event";

@Injectable()
export class CreateServiceService {
  private readonly logger = new Logger(CreateServiceService.name);
  constructor(
    private readonly serviceRepo: ServiceRepository,
    private readonly userRepo: UserRepository,
    private readonly events: EventBusPort,
  ) {}

  async execute(providerId: string, input: CreateServiceInput) {
    const user = await this.userRepo.findById(providerId);
    if (!user) {
      this.logger.warn(`Prestador de serviço ${providerId} não encontrado`);
      throw new NotFoundException("O prestador de serviço não foi encontrado");
    }

    const service = new ServiceEntity({
      providerId,
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      price: input.price,
      isActive: input.isActive,
    });

    await this.serviceRepo.save(service);
    this.logger.log(`Serviço ${service.id} criado`);
    this.events.publish([new ServiceCreatedEvent(service)]);
    this.logger.log(`Evento ServiceCreatedEvent emitido`);
    return service.publicData();
  }
}
