import { DynamicModule, Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserRepository } from "./repository/user.repo";
import { PrismaUserRepository } from "./infra/prisma-user.repo";
import { FakeUserRepository } from "./infra/fake-user.repo";
import { GetUserService } from "./services/get.user.service";
import { UpdateUserService } from "./services/update.user.service";

@Module({})
export class UserModule {
  static register(): DynamicModule {
    return {
      module: UserModule,
      controllers: [UserController],
      providers: [
        GetUserService,
        UpdateUserService,
        { provide: UserRepository, useClass: PrismaUserRepository },
      ],
      exports: [UserRepository],
    };
  }

  static onTesting(): DynamicModule {
    return {
      module: UserModule,
      controllers: [UserController],
      providers: [
        GetUserService,
        UpdateUserService,
        { provide: UserRepository, useClass: FakeUserRepository },
      ],
      exports: [UserRepository],
    };
  }
}
