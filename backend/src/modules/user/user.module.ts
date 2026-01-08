import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import UserRepository from './repository/user.repo';
import FakeUserRepository from './repository/fake.user.repo';
import PrismaUserRepository from './repository/prisma/prisma.user.repo';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      // useClass: FakeUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
