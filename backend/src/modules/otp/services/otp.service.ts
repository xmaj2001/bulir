import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import OtpEntity, { OtpPurpose } from '../entities/otp.entity';
import OtpRepository from '../repository/otp.repo';
import { MailSender } from '../../../adapters/mail/mail-sender.port';
import UserRepository from '../../../modules/user/repository/user.repo';
import { OtpValidateInput } from '../inputs/otp-validate.input';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: OtpRepository,
    private readonly mailSend: MailSender,
    private readonly userRepo: UserRepository,
  ) {}

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
      throw new NotFoundException('OTP inválido ou expirado');
    }

    await this.otpRepo.markAsUsed(otp.id);
    return otp;
  }

  async sendOtp(userId: string, purpose: OtpPurpose): Promise<OtpEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const otp = await this.generate(user.id, purpose);
    await this.mailSend.sendOtp(user.email, otp.code);
    return otp;
  }

  async validateOtp(input: OtpValidateInput, userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const otp = await this.validate(
      userId,
      input.code,
      input.purpose as OtpPurpose,
    );

    if (!otp) {
      throw new BadRequestException('OTP inválido ou expirado');
    }
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
