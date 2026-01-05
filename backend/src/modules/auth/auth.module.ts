import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import SessionRepository from './repository/session.repo';
import FakeSessionRepository from './repository/fake/fake.session';
import { PasswordHasher } from 'src/adapters/hasher/password-hasher.port';
import FakePasswordHasher from 'src/adapters/hasher/fake-hash';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: SessionRepository,
      useClass: FakeSessionRepository,
    },
    {
      provide: PasswordHasher,
      useClass: FakePasswordHasher,
    },
  ],
  imports: [UserModule],
})
export class AuthModule {}
