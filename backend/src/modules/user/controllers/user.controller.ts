import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../../shared/guard/auth.guard';
import { Roles } from '../../../shared/decorator/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RolesGuard } from '../../../shared/guard/roles.guard';
import { RequestWithUser } from '../../../shared/http/user-request';
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
  @Get()
  getById(@Req() req: RequestWithUser) {
    const id = req.user?.sub ?? '';
    return this.service.findById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Patch('/balance')
  updateBalance(
    @Body() input: UpdateBalanceInput,
    @Req() req: RequestWithUser,
  ) {
    const id = req.user?.sub ?? '';
    return this.service.updateBalance(id, input.amount);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Delete()
  deleteById(@Req() req: RequestWithUser) {
    const id = req.user?.sub ?? '';
    return this.service.delete(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER, UserRole.CLIENT)
  @Get('me')
  me(@Req() req: RequestWithUser) {
    const userId = req.user?.sub ?? '';
    return this.service.me(userId);
  }
}
