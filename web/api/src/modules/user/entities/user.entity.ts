import { Role } from "./enums/role.enum";
import { AuthProvider } from "./enums/auth-provider.enum";
import { AuthProviderAccountEntity } from "./auth-provider-account.entity";
import { BaseEntity } from "@shared/entities/base.entity";
import { DomainEvent } from "@shared/entities/domain-event.base";

interface UserProps {
  id?: string;
  name: string;
  email?: string;
  nif?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  passwordHash?: string | null;
  role?: Role;
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  accounts?: AuthProviderAccountEntity[];
}

export class UserEntity extends BaseEntity {
  public name: string;
  public email: string | null;
  public nif: string | null;
  public avatarUrl: string | null;
  public emailVerified: boolean;
  public passwordHash: string | null;
  public role: Role;
  public lastLoginAt: Date | null;
  private _accounts: AuthProviderAccountEntity[];
  private _events: DomainEvent[] = [];

  constructor(p: UserProps) {
    super(p.id, p.createdAt, p.updatedAt);
    this.name = p.name;
    this.email = p.email ?? null;
    this.nif = p.nif ?? null;
    this.avatarUrl = p.avatarUrl ?? null;
    this.emailVerified = p.emailVerified ?? false;
    this.passwordHash = p.passwordHash ?? null;
    this.role = p.role ?? Role.CLIENT;
    this.lastLoginAt = p.lastLoginAt ?? null;
    this._accounts = p.accounts ?? [];
  }

  // ── Comportamento ─────────────────────────────────────────────────────────

  verifyEmail(): void {
    this.emailVerified = true;
    this.touch();
  }

  updateInfo(data: { name?: string; avatarUrl?: string; nif?: string }) {
    if (data.name) this.name = data.name;
    if (data.avatarUrl) this.avatarUrl = data.avatarUrl;
    if (data.nif) this.nif = data.nif;
    this.touch();
  }

  upadatePassword(newPassword: string) {
    if (newPassword.length >= 8) {
      this.passwordHash = newPassword;
      this.touch();
    }
  }

  recordLogin(): void {
    this.lastLoginAt = new Date();
    this.touch();
  }

  linkProvider(account: AuthProviderAccountEntity): void {
    const exists = this._accounts.find((a) => a.provider === account.provider);
    if (exists) {
      exists.providerId = account.providerId;
    } else {
      this._accounts.push(account);
    }
    this.touch();
  }

  hasProvider(provider: AuthProvider): boolean {
    return this._accounts.some((a) => a.provider === provider);
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get accounts() {
    return [...this._accounts];
  }
  get domainEvents() {
    return [...this._events];
  }
  clearEvents() {
    this._events = [];
  }

  // ── Output ────────────────────────────────────────────────────────────────

  publicData() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      emailVerified: this.emailVerified,
      nif: this.nif,
      avatarUrl: this.avatarUrl,
      role: this.role,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
