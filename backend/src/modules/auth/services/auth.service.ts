import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import SessionRepository from '../repository/session.repo';
import UserRepository from 'src/modules/user/repository/user.repo';
import { AuthLoginInput, AuthRegisterInput } from '../inputs/auth.input';
import { PasswordHasher } from 'src/adapters/hasher/password-hasher.port';
import UserEntity, { UserRole } from 'src/modules/user/entities/user.entity';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly session: SessionRepository,
    private readonly user: UserRepository,
    private readonly hashPassword: PasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(input: AuthRegisterInput) {
    const existUserWithEmail = await this.user.findByEmail(input.email);
    if (existUserWithEmail) {
      throw new ConflictException(`O email ${input.email} já está em uso`);
    }

    const existUserWithNif = await this.user.findByNif(input.nif);
    if (existUserWithNif) {
      throw new ConflictException(`O NIF ${input.nif} já está em uso`);
    }

    const passwordHash = await this.hashPassword.hash(input.password);

    const newUser = new UserEntity();
    newUser.id = randomUUID();
    newUser.name = input.name;
    newUser.email = input.email;
    newUser.nif = input.nif;
    newUser.role = input.role as UserRole;
    newUser.balance = 0;
    newUser.setPassword(passwordHash);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    const createdUser = await this.user.create(newUser);

    return createdUser;
  }

  async login(input: AuthLoginInput) {
    if (!input.email && !input.nif) {
      throw new BadRequestException(
        `É necessário fornecer email ou NIF para login`,
      );
    }

    let existUser: UserEntity | null = null;

    if (input.email) {
      existUser = await this.user.findByEmail(input.email);
    } else if (input.nif) {
      existUser = await this.user.findByNif(input.nif);
    }

    if (!existUser) {
      throw new UnauthorizedException(`Credenciais inválidas`);
    }

    const isPasswordValid = await this.hashPassword.compare(
      input.password,
      existUser.getPassword(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Credenciais inválidas`);
    }

    return existUser;
  }
}
