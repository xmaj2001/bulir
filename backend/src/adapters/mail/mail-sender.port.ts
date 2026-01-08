export abstract class MailSender {
  abstract sendOtp(email: string, code: string): Promise<void>;
}
