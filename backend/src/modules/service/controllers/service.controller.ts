import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from '../services/service.service';
import { CreateServiceInput } from '../inputs/create-service';
import { AuthGuard } from '../../../shared/guard/auth.guard';
import { RolesGuard } from '../../../shared/guard/roles.guard';
import { Roles } from '../../../shared/decorator/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';
import { UpdateServiceInput } from '../inputs/upadate-service';
import { RequestWithUser } from 'src/shared/http/user-request';

@Controller('services')
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  create(@Body() input: CreateServiceInput, @Req() req: RequestWithUser) {
    const userId = req.user?.sub || '';
    return this.service.create(input, userId);
  }

  @Put()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  update(@Body() input: UpdateServiceInput, @Req() req: RequestWithUser) {
    const userId = req.user?.sub || '';
    return this.service.update(input, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('provider/:providerId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  getByProviderId(@Param('providerId') providerId: string) {
    return this.service.findbyProviderId(providerId);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  getAll(@Query('page') page: number, @Query('items') items: number) {
    return this.service.findPaginated(page, items);
  }
}
