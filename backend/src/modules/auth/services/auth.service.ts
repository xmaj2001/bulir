import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import SessionRepository from '../repository/session.repo';
import UserRepository from 'src/modules/user/repository/user.repo';
import { AuthLoginInput, AuthRegisterInput } from '../inputs/auth.input';
import { PasswordHasher } from 'src/adapters/hasher/password-hasher.port';
import UserEntity, { UserRole } from 'src/modules/user/entities/user.entity';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import SessionEntity from '../entities/session.entity';
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

  async login(input: AuthLoginInput, ip: string, device: string) {
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
    const tokens = this.generateTokens(existUser);
    const session = await this.handleSession(
      existUser,
      ip,
      device,
      tokens.refreshToken,
    );
    return { ...tokens, sessionId: session.id, role: existUser.role };
  }

  private generateTokens(user: UserEntity) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private async handleSession(
    user: UserEntity,
    ip: string,
    device: string,
    refreshTokenHash: string,
  ) {
    const activeSession = await this.session.getActiveForDevice(
      user.id,
      device,
    );
    if (activeSession) {
      Logger.log(
        `Sessão ativa encontrada para o usuário ${user.id} no dispositivo ${device}`,
      );
      return activeSession;
    }

    const latestSession = await this.session.getLatest(user.id);
    if (latestSession) {
      Logger.warn(`Revogando sessão antiga do usuário ${user.id}`);
      await this.session.revoke(latestSession.id);
    }

    const newSession = new SessionEntity({
      id: randomUUID(),
      userId: user.id,
      ip,
      device,
      refreshTokenHash,
      createdAt: new Date(),
    });
    return this.session.create(newSession);
  }
}
