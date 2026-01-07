import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Token não fornecido');

    try {
      const payload: any = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
      });

      (request as any).user = payload;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractToken(request: Request) {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }
}
