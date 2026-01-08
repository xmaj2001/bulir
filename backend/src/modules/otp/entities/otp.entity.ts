import { randomUUID } from 'crypto';

export enum OtpPurpose {
  ACCOUNT_ACTIVATION = 'account_activation',
  CHANGE_PASSWORD = 'change_password',
  VERIFY_EMAIL = 'verify_email',
}

export default class OtpEntity {
  id: string;
  userId: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  usedAt?: Date | undefined | null;

  createdAt: Date;
  constructor(partial: Partial<OtpEntity>) {
    this.createdAt = new Date();
    this.userId = randomUUID() || '';
    Object.assign(this, partial);
  }
}
