import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { RolesGuard } from "@common/guards/roles.guard";
import { CreateBookingService } from "../services/create-booking.service";
import { CreateBookingInput } from "../inputs/create-booking.input";
import { CancelBookingService } from "../services/cancel-booking.service";
import { ListMyBookingsService } from "../services/list-my-bookings.service";
import { ListProviderBookingsService } from "../services/list-order.service";
import { CompleteBookingService } from "../services/complete-booking.service";
import { Param } from "@nestjs/common";
import { CancelBookingInput } from "../inputs/cancel-booking.input";

@ApiTags("Bookings")
@Controller("bookings")
@UseGuards(RolesGuard)
export class BookingController {
  constructor(
    private readonly createBooking: CreateBookingService,
    private readonly listMyBookings: ListMyBookingsService,
    private readonly listProviderBookings: ListProviderBookingsService,
    private readonly completeBooking: CompleteBookingService,
    private readonly cancelBooking: CancelBookingService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cria uma nova reserva" })
  async createBookingEndpoint(
    @CurrentUser() user: AuthUser,
    @Body() input: CreateBookingInput,
  ) {
    const booking = await this.createBooking.execute(user.sub, input);
    return booking;
  }

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Lista as minhas reservas (como cliente)",
  })
  async findMyBookings(@CurrentUser() user: AuthUser) {
    return this.listMyBookings.execute(user.sub);
  }

  @Get("provider")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lista os pedidos de reserva recebidos" })
  async findProviderBookings(@CurrentUser() user: AuthUser) {
    return this.listProviderBookings.execute(user.sub);
  }

  @Post(":id/complete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Completa uma reserva (pelo provider)" })
  async completeBookingEndpoint(
    @CurrentUser() user: AuthUser,
    @Param("id") bookingId: string,
  ) {
    return this.completeBooking.execute(user.sub, bookingId);
  }

  @Post(":id/cancel")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancela uma reserva" })
  async cancelBookingEndpoint(
    @CurrentUser() user: AuthUser,
    @Param("id") bookingId: string,
    @Body() input: CancelBookingInput,
  ) {
    const booking = await this.cancelBooking.execute(
      user.sub,
      bookingId,
      input.reason,
    );
    return booking;
  }
}
