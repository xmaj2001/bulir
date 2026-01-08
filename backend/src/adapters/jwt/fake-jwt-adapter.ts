import { Injectable } from '@nestjs/common';
import { JwtServicePort } from '../../adapters/jwt/jwt-service.port';

@Injectable()
export class FakeJwtAdapter implements JwtServicePort {
  async sign(payload: object): Promise<string> {
    await Promise.resolve();
    return `fake-token-${JSON.stringify(payload)}`;
  }

  async verify<T = any>(token: string): Promise<T> {
    await Promise.resolve();
    const payloadStr = token.replace('fake-token-', '');
    return JSON.parse(payloadStr) as T;
  }

  async signRefreshToken(payload: object): Promise<string> {
    await Promise.resolve();
    return `fake-refresh-${JSON.stringify(payload)}`;
  }
}
