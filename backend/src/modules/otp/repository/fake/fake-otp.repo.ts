import OtpEntity, { OtpPurpose } from '../../entities/otp.entity';
import OtpRepository from '../otp.repo';

export default class FakeOtpRepository implements OtpRepository {
  private otps: OtpEntity[] = [];

  async create(otp: OtpEntity): Promise<void> {
    await Promise.resolve();
    this.otps.push(otp);
  }

  async find(
    userId: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<OtpEntity | null> {
    const now = new Date();
    await Promise.resolve();
    return (
      this.otps.find(
        (otp) =>
          otp.userId === userId &&
          otp.code === code &&
          otp.purpose === purpose &&
          otp.expiresAt > now &&
          !otp.usedAt,
      ) || null
    );
  }

  async markAsUsed(otpId: string): Promise<void> {
    await Promise.resolve();
    const otp = this.otps.find((o) => o.id === otpId);
    if (otp) {
      otp.usedAt = new Date();
    }
  }
}
