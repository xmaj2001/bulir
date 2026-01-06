import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationInput } from '../inputs/create-reservation';
import { AuthGuard } from '../../../shared/guard/auth.guard';
import type { RequestWithUser } from 'src/shared/http/user-request';
import { RolesGuard } from 'src/shared/guard/roles.guard';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { UserRole } from 'src/modules/user/entities/user.entity';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  create(@Body() input: CreateReservationInput) {
    return this.service.create(input);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT, UserRole.PROVIDER)
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('client/:clientId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  findByClientId(@Param('clientId') clientId: string) {
    return this.service.findByClientId(clientId);
  }

  @Delete(':id/cancel')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  cancel(@Param('id') reservationId: string, @Req() req: RequestWithUser) {
    const userId = req.user?.sub;
    return this.service.cancel(reservationId, userId ?? '');
  }
}
