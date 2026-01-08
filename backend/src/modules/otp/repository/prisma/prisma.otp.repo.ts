import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import OtpEntity, { OtpPurpose } from '../../entities/otp.entity';
import OtpRepository from '../otp.repo';

@Injectable()
export default class PrismaOtpRepository implements OtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(otp: OtpEntity): Promise<void> {
    await this.prisma.otp.create({
      data: {
        id: otp.id,
        code: otp.code,
        userId: otp.userId,
        purpose: otp.purpose,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt,
      },
    });
  }

  async find(
    userId: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<OtpEntity | null> {
    const purposeString =
      purpose === OtpPurpose.ACCOUNT_ACTIVATION
        ? 'account_activation'
        : 'change_password';

    const prismaOtp = await this.prisma.otp.findFirst({
      where: {
        userId,
        code,
        purpose: purposeString,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    const otpEntity = prismaOtp
      ? new OtpEntity({
          id: prismaOtp.id,
          code: prismaOtp.code,
          userId: prismaOtp.userId,
          purpose: prismaOtp.purpose as OtpPurpose,
          expiresAt: prismaOtp.expiresAt,
          createdAt: prismaOtp.createdAt,
          usedAt: prismaOtp.usedAt,
        })
      : null;

    return otpEntity;
  }

  async validate(
    userId: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    const otp = await this.find(userId, code, purpose);
    return otp !== null;
  }

  async markAsUsed(otpId: string): Promise<void> {
    await this.prisma.otp.update({
      where: { id: otpId },
      data: {
        usedAt: new Date(),
      },
    });
  }
}
