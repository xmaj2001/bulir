import { MailSender } from './mail-sender.port';

export class GoogleScriptMailSender implements MailSender {
  async sendOtp(email: string, code: string): Promise<void> {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbz-_9KQaffQDvrt9-k1mHY50b3OBhz4Wsg8n3RNHo-HP5tkwVdBmkY8mpRFRh_Evxoj/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          mensagem: code,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Falha ao enviar OTP por email');
    }
  }
}
