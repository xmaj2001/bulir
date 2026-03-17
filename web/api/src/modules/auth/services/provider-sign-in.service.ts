import { AuthProvider } from "@modules/user/entities/enums/auth-provider.enum";
import { UserRepository } from "@modules/user/repository/user.repo";
import { Injectable, Logger } from "@nestjs/common";
import { TokenPort } from "@shared/adapters/token/token.port";
import { ProviderSignInInput } from "../inputs/provider-sign-in.input";
import { AuthProviderAccountEntity } from "@modules/user/entities/auth-provider-account.entity";
import { UserEntity } from "@modules/user/entities/user.entity";

const PROVIDER_MAP: Record<string, AuthProvider> = {
  google: AuthProvider.GOOGLE,
};

@Injectable()
export class ProviderSignInService {
  private readonly logger = new Logger(ProviderSignInService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly token: TokenPort,
  ) {}

  async execute(input: ProviderSignInInput) {
    const providerEnum = PROVIDER_MAP[input.provider];
    if (!providerEnum)
      throw new Error(`Provider desconhecido: ${input.provider}`);

    let user = await this.userRepo.findByEmail(input.email);

    if (user) {
      if (!user.hasProvider(providerEnum)) {
        this.logger.log(
          `Ligando provider ${input.provider} ao user ${user.id}`,
        );
        user.linkProvider(
          new AuthProviderAccountEntity({
            userId: user.id,
            provider: providerEnum,
            providerId: input.providerId,
          }),
        );
      }

      if (input.emailVerified && !user.emailVerified) {
        user.verifyEmail();
      }
    } else {
      this.logger.log(`Novo utilizador via ${input.provider}: ${input.email}`);
      user = new UserEntity({
        name: input.name,
        email: input.email,
        avatarUrl: input.avatarUrl,
        emailVerified: input.emailVerified,
        passwordHash: null,
      });

      if (input.emailVerified) user.verifyEmail();

      user.linkProvider(
        new AuthProviderAccountEntity({
          userId: user.id,
          provider: providerEnum,
          providerId: input.providerId,
        }),
      );
    }

    user.recordLogin();
    await this.userRepo.save(user);

    const pair = this.token.generatePair({
      sub: user.id,
      role: user.role,
    });

    return { user: user.publicData(), ...pair };
  }
}
