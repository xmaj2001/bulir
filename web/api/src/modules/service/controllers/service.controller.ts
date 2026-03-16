import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreateServiceService } from "../services/create-service.service";
import { CreateServiceInput } from "../inputs/create-service.input";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { RolesGuard } from "@common/guards/roles.guard";
import { Public } from "@common/decorators/public.decorator";
import { GetServiceService } from "../services/get-service.service";

@ApiTags("Services")
@Controller("services")
@UseGuards(RolesGuard)
export class ServiceController {
  constructor(
    private readonly createService: CreateServiceService,
    private readonly getService: GetServiceService,
  ) {}

  @Post()
  // @Roles(Role.PROVIDER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cria um novo serviço" })
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
  @ApiOperation({ summary: "Lista os meus serviços" })
  async findMine(@CurrentUser() user: AuthUser) {
    const services = await this.getService.findMine(user.sub);
    return services;
  }
}
