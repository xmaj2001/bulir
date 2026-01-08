export abstract class JwtServicePort {
  abstract sign(payload: object, expiresIn?: string | number): Promise<string>;
  abstract verify<T = any>(token: string): Promise<T>;
  abstract signRefreshToken(
    payload: object,
    expiresIn?: string | number,
  ): Promise<string>;
}
