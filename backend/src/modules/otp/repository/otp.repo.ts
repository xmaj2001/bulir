import OtpEntity, { OtpPurpose } from '../entities/otp.entity';

export default abstract class OtpRepository {
  abstract create(otp: OtpEntity): Promise<void>;

  abstract find(
    userId: string,
    code: string,
    purpose: OtpPurpose,
  ): Promise<OtpEntity | null>;

  abstract markAsUsed(otpId: string): Promise<void>;
}
