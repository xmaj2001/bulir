import {
  Injectable,
  ConflictException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { UserRepository } from "@modules/user/repository/user.repo";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { UserEntity } from "@modules/user/entities/user.entity";
import { EmailSignUpInput } from "../inputs/email-sign-up.input";
import { NifSignUpInput } from "../inputs/nif-sign-up.input";

@Injectable()
export class SignUpService {
  private readonly logger = new Logger(SignUpService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly hash: HashPort,
  ) {}

  async signUpEmail(input: EmailSignUpInput): Promise<{ message: string }> {
    const existsByEmail = await this.userRepo.findByEmail(input.email);
    if (existsByEmail) throw new ConflictException("Email já registado");

    const passwordHash = await this.hash.hash(input.password);

    const user = new UserEntity({
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash,
      emailVerified: false,
    });

    await this.userRepo.save(user);

    this.logger.log(`Utilizador registado: ${user.id} via ${input.email}`);

    return {
      message: "Conta criada.",
    };
  }

  async signUpNif(input: NifSignUpInput): Promise<{ message: string }> {
    const existsByNif = await this.userRepo.findByNif(input.nif);
    if (existsByNif) throw new ConflictException("NIF já registado");

    const passwordHash = await this.hash.hash(input.password);

    const user = new UserEntity({
      name: input.name,
      nif: input.nif,
      role: input.role,
      passwordHash,
      emailVerified: false,
    });

    await this.userRepo.save(user);

    this.logger.log(`Utilizador registado: ${user.id} via ${input.nif}`);

    return {
      message: "Conta criada.",
    };
  }
}
