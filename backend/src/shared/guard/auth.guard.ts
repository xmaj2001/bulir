import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import SessionRepository from 'src/modules/auth/repository/session.repo';
import IPayload from '../interfaces/payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    // private readonly session: SessionRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Token não fornecido');

    try {
      const payload: any = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
      });

      // const session = await this.session.findById(payload.sessionId);

      // if (!session || session.revokedAt)
      //   throw new UnauthorizedException('Sessão inválida ou revogada');

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
