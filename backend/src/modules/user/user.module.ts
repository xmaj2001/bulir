import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import UserRepository from './repository/user.repo';
import FakeUserRepository from './repository/fake.user.repo';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: FakeUserRepository,
    },
  ],
})
export class UserModule {}
