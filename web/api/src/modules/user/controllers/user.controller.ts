import {
  Controller,
  Get,
  UseGuards,
  Logger,
  Body,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import {
  AuthUser,
  CurrentUser,
} from "@common/decorators/current-user.decorator";
import { UpdateUserInput } from "../inputs/update-user.input";
import { GetUserService } from "../services/get.user.service";
import { UpdateUserService } from "../services/update.user.service";
import { Roles } from "@common/decorators/roles.decorator";
import { RolesGuard } from "@common/guards/roles.guard";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly getservice: GetUserService,
    private readonly updateService: UpdateUserService,
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Perfil do utilizador autenticado" })
  @ApiResponse({ status: 200, description: "Dados do utilizador" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  async me(@CurrentUser() user: AuthUser) {
    return this.getservice.execute(user.sub);
  }

  @Patch("me")
  @ApiOperation({ summary: "Actualizar perfil do utilizador autenticado" })
  @ApiResponse({ status: 200, description: "Perfil actualizado" })
  @ApiResponse({ status: 404, description: "Utilizador não encontrado" })
  @ApiResponse({ status: 422, description: "Input inválido" })
  async update(@CurrentUser() user: AuthUser, @Body() input: UpdateUserInput) {
    return this.updateService.execute(user.sub, input);
  }

  @Get()
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Listar todos os utilizadores (Admin)" })
  @ApiResponse({ status: 200, description: "Lista de utilizadores" })
  @ApiResponse({ status: 401, description: "Não autenticado" })
  @ApiResponse({ status: 403, description: "Sem permissão — requer ADMIN" })
  async getAll() {
    return this.getservice.getAll();
  }
}
