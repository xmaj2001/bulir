import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Param,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { CreateServiceService } from "../services/create-service.service";
import { CreateServiceInput } from "../inputs/create-service.input";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { RolesGuard } from "@common/guards/roles.guard";
import { Public } from "@common/decorators/public.decorator";
import { GetServiceService } from "../services/get-service.service";
import { SearchServiceService } from "../services/search-service.service";
import {
  ApiErrorResponse,
  ApiSuccessArrayResponse,
  ApiSuccessResponse,
} from "@common/responses/envelope.response";
import {
  PaginatedServicesResponse,
  ServiceResponse,
} from "../responses/service.response";

@ApiTags("Services")
@Controller("services")
@UseGuards(RolesGuard)
export class ServiceController {
  constructor(
    private readonly createService: CreateServiceService,
    private readonly getService: GetServiceService,
    private readonly searchService: SearchServiceService,
  ) {}

  @Post()
  // @Roles(Role.PROVIDER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cria um novo serviço" })
  @ApiResponse({
    status: 201,
    type: ApiSuccessResponse(ServiceResponse),
    description: "Serviço criado com sucesso",
  })
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
  @ApiResponse({
    status: 200,
    type: ApiSuccessArrayResponse(ServiceResponse),
    description: "Lista de serviços ativos",
  })
  async findAll() {
    const services = await this.getService.findAllActive();
    return services;
  }

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lista os meus serviços" })
  @ApiResponse({
    status: 200,
    type: ApiSuccessArrayResponse(ServiceResponse),
    description: "Meus serviços",
  })
  async findMine(@CurrentUser() user: AuthUser) {
    const services = await this.getService.findMine(user.sub);
    return services;
  }

  @Get("search")
  @Public()
  @ApiOperation({ summary: "Busca serviços por nome/descrição e preço" })
  @ApiQuery({ name: "q", required: false, type: String })
  @ApiQuery({ name: "minPrice", required: false, type: Number })
  @ApiQuery({ name: "maxPrice", required: false, type: Number })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    type: ApiSuccessResponse(PaginatedServicesResponse),
    description: "Resultado da busca",
  })
  async search(
    @Query("q") query?: string,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.searchService.execute({
      query,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Busca um serviço pelo ID" })
  @ApiResponse({
    status: 200,
    type: ApiSuccessResponse(ServiceResponse),
    description: "Serviço encontrado",
  })
  @ApiResponse({
    status: 404,
    type: ApiErrorResponse,
    description: "Serviço não encontrado",
  })
  async findOne(@Param("id") id: string) {
    return this.getService.findOne(id);
  }
}
