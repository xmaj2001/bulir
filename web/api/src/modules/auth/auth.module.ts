import { DynamicModule, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { TokenModule } from "@shared/adapters/token/token.module";
import { UserModule } from "@modules/user/user.module";
import { EmailModule } from "@shared/adapters/email/email.module";
import { ProviderSignInService } from "./services/provider-sign-in.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { VerificationRepository } from "./repository/verification.repo";
import { PrismaVerificationRepository } from "./infra/prisma-verification.repo";
import { FakeVerificationRepository } from "./infra/fake-verification.repo";
import { SendOtpProcessor } from "./jobs/send-otp.processor";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { HashAdapter } from "@shared/adapters/hash/hash.adapter";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { ResetPasswordService } from "./services/reset-password.service";
import { ForgotPasswordService } from "./services/forgot-password.service";
import { PasswordResetRequestedListener } from "./listeners/password-reset-requested.listener";
import { AuthEmailController } from "./controllers/auth-email.controller";
import { AuthPasswordController } from "./controllers/auth-password.controller";
import { AuthProviderController } from "./controllers/auth-provider.controller";
import { AuthSessionController } from "./controllers/auth-session.controller";
import { SignUpService } from "./services/sign-up.service";
import { SignInService } from "./services/sign-in.service";
import { AuthNifController } from "./controllers/auth-nif.controller";

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        TokenModule,
        EmailModule,
        UserModule.register(),
        // TODO: Criar uma constante para o nome da fila para não repetir string ou errar
        BullModule.registerQueue({ name: "auth" }),
      ],
      controllers: [
        AuthEmailController,
        AuthNifController,
        AuthPasswordController,
        AuthProviderController,
        AuthSessionController,
      ],
      providers: [
        SignUpService,
        SignInService,
        ProviderSignInService,
        RefreshTokenService,
        ResetPasswordService,
        ForgotPasswordService,
        SendOtpProcessor,
        PasswordResetRequestedListener,
        {
          provide: VerificationRepository,
          useClass: PrismaVerificationRepository,
        },
        { provide: HashPort, useClass: HashAdapter },
        { provide: EventBusPort, useClass: EventBusAdapter },
      ],
    };
  }

  static onTesting(): DynamicModule {
    return {
      module: AuthModule,
      imports: [TokenModule, UserModule.onTesting(), EmailModule],
      controllers: [
        AuthEmailController,
        AuthNifController,
        AuthPasswordController,
        AuthProviderController,
        AuthSessionController,
      ],
      providers: [
        SignUpService,
        SignInService,
        ProviderSignInService,
        RefreshTokenService,
        ResetPasswordService,
        ForgotPasswordService,
        SendOtpProcessor,
        PasswordResetRequestedListener,
        {
          provide: VerificationRepository,
          useClass: FakeVerificationRepository,
        },
        { provide: HashPort, useClass: HashAdapter },
        { provide: EventBusPort, useValue: { publish: async () => {} } },
        { provide: "BullQueue_auth", useValue: { add: async () => ({}) } },
      ],
    };
  }
}
