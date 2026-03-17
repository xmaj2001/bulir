import { UserRepository } from "@modules/user/repository/user.repo";
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { TokenPort } from "@shared/adapters/token/token.port";
import { EmailSignInInput } from "../inputs/email-sign-in.input";
import { NifSignInInput } from "../inputs/nif-sign-in.input";

@Injectable()
export class SignInService {
  private readonly logger = new Logger(SignInService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly hash: HashPort,
    private readonly token: TokenPort,
  ) {}

  async signInEmail(input: EmailSignInInput) {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        "Esta conta usa login social. Usa Google/GitHub/42Intra.",
      );
    }

    const valid = await this.hash.compare(input.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login falhado: ${input.email}`);
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // if (!user.emailVerified) {
    //   throw new ForbiddenException(
    //     "Email não verificado. Verifica o teu email para continuar.",
    //   );
    // }

    user.recordLogin();
    await this.userRepo.save(user);

    this.logger.log(`Login: ${user.id}`);
    const pair = this.token.generatePair({
      sub: user.id,
      role: user.role,
    });
    return { user: user.publicData(), ...pair };
  }

  async signInNif(input: NifSignInInput) {
    const user = await this.userRepo.findByNif(input.nif);
    if (!user) throw new UnauthorizedException("Credenciais inválidas");

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        "Esta conta usa login social. Usa Google/GitHub/42Intra.",
      );
    }

    const valid = await this.hash.compare(input.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login falhado: ${input.nif}`);
      throw new UnauthorizedException("Credenciais inválidas");
    }

    user.recordLogin();
    await this.userRepo.save(user);

    this.logger.log(`Login: ${user.id}`);
    const pair = this.token.generatePair({
      sub: user.id,
      role: user.role,
    });
    return { user: user.publicData(), ...pair };
  }
}
