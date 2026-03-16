import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { BookingRepository } from "../repository/booking.repo";
import { ServiceRepository } from "../repository/service.repo";
import { BookingEntity } from "../entities/booking.entity";
import { CreateBookingInput } from "../inputs/create-booking.input";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { BookingCreatedEvent } from "../events/booking-created.event";
import { Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/repository/user.repo";

@Injectable()
export class CreateBookingService {
  private readonly logger = new Logger(CreateBookingService.name);

  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly serviceRepo: ServiceRepository,
    private readonly userRepo: UserRepository,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(clientId: string, input: CreateBookingInput) {
    const service = await this.serviceRepo.findById(input.serviceId);
    if (!service) {
      throw new NotFoundException("Serviço não encontrado");
    }

    if (!service.isActive) {
      throw new BadRequestException("Este serviço não está ativo no momento");
    }

    const client = await this.userRepo.findById(clientId);
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }

    if (Number(client.balance) < Number(service.price)) {
      throw new BadRequestException("Saldo insuficiente");
    }

    if (service.providerId === clientId) {
      throw new BadRequestException("Não podes reservar o teu próprio serviço");
    }

    const booking = new BookingEntity({
      clientId,
      serviceId: service.id,
      totalPrice: service.price,
      notes: input.notes,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    });

    await this.bookingRepo.save(booking);

    this.logger.log(`Booking ${booking.id} criado para o cliente ${clientId}`);

    this.logger.log(
      `Publicando evento BookingCreatedEvent para booking ${booking.id}`,
    );

    this.eventBus.publish([
      new BookingCreatedEvent(
        booking.id,
        booking.clientId,
        booking.totalPrice,
        service.providerId,
      ),
    ]);

    return booking.publicData();
  }
}
