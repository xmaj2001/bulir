import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../../shared/guard/auth.guard';
import { Roles } from '../../../shared/decorator/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RolesGuard } from '../../../shared/guard/roles.guard';
import { RequestWithUser } from 'src/shared/http/user-request';
import { UpdateBalanceInput } from '../inputs/update-balance-user';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Get('email/:email')
  getByEmail(@Param('email') email: string) {
    return this.service.findByEmail(email);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Get('nif/:nif')
  getByNif(@Param('nif') nif: string) {
    return this.service.findByNif(nif);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Put('/balance')
  updateBalance(
    @Body() input: UpdateBalanceInput,
    @Req() req: RequestWithUser,
  ) {
    const id = req.user?.sub ?? '';
    return this.service.updateBalance(id, input.amount);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
