import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreateServiceService } from "../services/create-service.service";
import { ServiceRepository } from "../repository/service.repo";
import { CreateServiceInput } from "../inputs/create-service.input";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { Roles } from "@common/decorators/roles.decorator";
import { Role } from "@modules/user/entities/enums/role.enum";
import { RolesGuard } from "@common/guards/roles.guard";
import { Public } from "@common/decorators/public.decorator";
import { GetServiceService } from "../services/get-service.service";
import { CreateBookingService } from "../services/create-booking.service";
import { CreateBookingInput } from "../inputs/create-booking.input";
import { BookingRepository } from "../repository/booking.repo";
import { CancelBookingService } from "../services/cancel-booking.service";
import { Param } from "@nestjs/common";

@ApiTags("Services")
@Controller("services")
@UseGuards(RolesGuard)
export class ServiceController {
  constructor(
    private readonly createService: CreateServiceService,
    private readonly getService: GetServiceService,
    private readonly createBooking: CreateBookingService,
    private readonly cancelBooking: CancelBookingService,
    private readonly bookingRepo: BookingRepository,
  ) {}

  @Post()
  // @Roles(Role.PROVIDER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cria um novo serviço (Apenas Providers/Admins)" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() input: CreateServiceInput,
  ) {
    const service = await this.createService.execute(user.sub, input);
    return service;
  }

  @Get()
  @Public()
  @ApiOperation({ summary: "Lista todos os serviços ativos" })
  async findAll() {
    const services = await this.getService.findAllActive();
    return services;
  }

  @Get("mine")
  // @Roles(Role.PROVIDER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lista os meus serviços (Apenas Providers/Admins)" })
  async findMine(@CurrentUser() user: AuthUser) {
    const services = await this.getService.findMine(user.sub);
    return services;
  }

  // ── Bookings ──────────────────────────────────────────────────────────────

  @Post("bookings")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cria uma nova reserva" })
  async createBookingEndpoint(
    @CurrentUser() user: AuthUser,
    @Body() input: CreateBookingInput,
  ) {
    const booking = await this.createBooking.execute(user.sub, input);
    return booking;
  }

  @Get("bookings/mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lista as minhas reservas (como cliente)" })
  async findMyBookings(@CurrentUser() user: AuthUser) {
    const bookings = await this.bookingRepo.findByClientId(user.sub);
    return bookings.map((b) => b.publicData());
  }

  @Post("bookings/:id/cancel")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancela uma reserva" })
  async cancelBookingEndpoint(
    @CurrentUser() user: AuthUser,
    @Param("id") bookingId: string,
    @Body("reason") reason?: string,
  ) {
    const booking = await this.cancelBooking.execute(
      user.sub,
      bookingId,
      reason,
    );
    return booking;
  }
}
