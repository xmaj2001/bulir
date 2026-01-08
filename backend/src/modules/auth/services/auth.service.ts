import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import UserRepository from '../../user/repository/user.repo';
import {
  AuthActivateAccountInput,
  AuthChangePasswordInput,
  AuthLoginInput,
  AuthRegisterInput,
} from '../inputs/auth.input';
import { PasswordHasher } from '../../../adapters/hasher/password-hasher.port';
import UserEntity, {
  UserAcountStatus,
  UserRole,
} from '../../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../../otp/services/otp.service';
import { OtpPurpose } from '../../otp/entities/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserRepository,
    private readonly hashPassword: PasswordHasher,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
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
    newUser.status = UserAcountStatus.ACTIVE;
    newUser.setPassword(passwordHash);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();

    const createdUser = await this.user.create(newUser);

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    };
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

    // if (existUser.status !== UserAcountStatus.ACTIVE) {
    //   throw new UnauthorizedException(`Conta de usuário não está ativa`);
    // }

    const tokens = this.generateTokens(existUser);
    const userPublicData = {
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      nif: existUser.nif,
      role: existUser.role,
    };
    return { ...tokens, user: userPublicData };
  }

  async requestPasswordChange(userId: string): Promise<void> {
    await this.otpService.sendOtp(userId, OtpPurpose.CHANGE_PASSWORD);
  }

  async activateAccount(
    userId: string,
    input: AuthActivateAccountInput,
  ): Promise<void> {
    const user = await this.user.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.otpService.validate(
      userId,
      input.code,
      OtpPurpose.ACCOUNT_ACTIVATION,
    );
    user.status = UserAcountStatus.ACTIVE;
    user.updatedAt = new Date();
    await this.user.update(user);
  }

  async changePassword(userId: string, input: AuthChangePasswordInput) {
    const existUser = await this.user.findById(userId);
    if (!existUser) {
      throw new UnauthorizedException(`Usuário não encontrado`);
    }

    const isOldPasswordValid = await this.hashPassword.compare(
      input.oldPassword,
      existUser.getPassword(),
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException(`Senha antiga inválida`);
    }

    await this.otpService.validate(
      userId,
      input.code,
      OtpPurpose.CHANGE_PASSWORD,
    );
    const newPasswordHash = await this.hashPassword.hash(input.newPassword);
    existUser.setPassword(newPasswordHash);
    existUser.updatedAt = new Date();

    await this.user.update(existUser);

    return { message: 'Senha alterada com sucesso' };
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
      });

      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          role: payload.role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
          // TODO: ajustar tempo de expiração
          expiresIn: '3d',
        },
      );

      return { accessToken: newAccessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  private generateTokens(user: UserEntity) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
      // TODO: ajustar tempo de expiração
      expiresIn: '3d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
      // TODO: ajustar tempo de expiração
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
