import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import OtpEntity, { OtpPurpose } from '../entities/otp.entity';
import OtpRepository from '../repository/otp.repo';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepo: OtpRepository) {}

  async generate(userId: string, purpose: OtpPurpose): Promise<OtpEntity> {
    const otp = new OtpEntity({
      id: randomUUID(),
      userId,
      code: this.generateCode(),
      purpose,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 1000),
    });

    await this.otpRepo.create(otp);

    return otp;
  }

  async validate(
    userId: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<OtpEntity> {
    const otp = await this.otpRepo.find(userId, code, purpose);

    if (!otp) {
      throw new Error('OTP inválido ou expirado');
    }

    await this.otpRepo.markAsUsed(otp.id);
    return otp;
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
