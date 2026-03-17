import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../shared/database/prisma.service";
import { UserRepository } from "../repository/user.repo";
import { UserEntity } from "../entities/user.entity";
import { AuthProviderAccountEntity } from "../entities/auth-provider-account.entity";
import { Role } from "../entities/enums/role.enum";
import { AuthProvider } from "../entities/enums/auth-provider.enum";

@Injectable()
export class PrismaUserRepository extends UserRepository {
  private readonly logger = new Logger(PrismaUserRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async deposit(
    userId: string,
    balanceBefore: number,
    balanceAfter: number,
  ): Promise<void> {
    const amount = balanceAfter - balanceBefore;
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: balanceAfter },
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          type: "CREDIT",
          reason: "MANUAL_ADJUSTMENT",
          amount,
          balanceBefore,
          balanceAfter,
        },
      });
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
      include: { accounts: true },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(): Promise<UserEntity[] | []> {
    const raws = await this.prisma.user.findMany();
    const data = raws.map((entity) => {
      return this.toDomain(entity);
    });
    return data;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findByNif(nif: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { nif },
      include: { accounts: true },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async save(user: UserEntity): Promise<void> {
    await this.prisma.$transaction(async (tx: any) => {
      await tx.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          nif: user.nif,
          emailVerified: user.emailVerified,
          passwordHash: user.passwordHash,
          avatarUrl: user.avatarUrl,
          role: user.role,
          balance: user.balance,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        update: {
          name: user.name,
          email: user.email,
          nif: user.nif,
          emailVerified: user.emailVerified,
          passwordHash: user.passwordHash,
          avatarUrl: user.avatarUrl,
          role: user.role,
          balance: user.balance,
          lastLoginAt: user.lastLoginAt,
          updatedAt: user.updatedAt,
        },
      });

      for (const acc of user.accounts) {
        await tx.authProviderAccount.upsert({
          where: { id: acc.id },
          create: {
            id: acc.id,
            userId: user.id,
            provider: acc.provider,
            providerId: acc.providerId,
          },
          update: {
            providerId: acc.providerId,
            updatedAt: new Date(),
          },
        });
      }
    });
    this.logger.debug(`User ${user.id} persistido`);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(raw: any): UserEntity {
    const accounts = (raw.accounts ?? []).map(
      (a: any) =>
        new AuthProviderAccountEntity({
          id: a.id,
          userId: a.userId,
          provider: a.provider as AuthProvider,
          providerId: a.providerId,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }),
    );

    return new UserEntity({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      nif: raw.nif,
      emailVerified: raw.emailVerified,
      passwordHash: raw.passwordHash,
      avatarUrl: raw.avatarUrl,
      role: raw.role as Role,
      balance: raw.balance,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      accounts,
    });
  }
}
