import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RolesGuard } from 'src/shared/guard/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  getAll() {
    return this.service.findAll();
  }

  @Get('email/:email')
  getByEmail(@Param('email') email: string) {
    return this.service.findByEmail(email);
  }

  @Get('nif/:nif')
  getByNif(@Param('nif') nif: string) {
    return this.service.findByNif(nif);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id/balance')
  updateUserBalance(
    @Param('id') id: string,
    @Body() updateBalanceDto: { amount: number },
  ) {
    return this.service.updateBalance(id, updateBalanceDto.amount);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
