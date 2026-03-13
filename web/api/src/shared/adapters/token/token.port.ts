export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export abstract class TokenPort {
  abstract generatePair(payload: { sub: string; role: string }): TokenPair;
  abstract verifyAccess(token: string): {
    sub: string;
    role: string;
  };
  abstract verifyRefresh(token: string): { sub: string };
}
