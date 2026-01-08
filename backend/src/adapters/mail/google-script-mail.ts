import { MailSender } from './mail-sender.port';

export class GoogleScriptMailSender implements MailSender {
  async sendOtp(email: string, code: string): Promise<void> {
    const response = await fetch(process.env.GOOGLE_SCRIPT_MAIL_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        mensagem: code,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar OTP por email');
    }
  }
}
