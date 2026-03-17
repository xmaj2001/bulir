import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { TokenPort } from "../../shared/adapters/token/token.port";
import { IS_OPTIONAL_KEY } from "@common/decorators/optional.decorator";

/**
 * JwtAuthGuard — guard global aplicado a todas as rotas.
 * Rotas marcadas com @Public() são ignoradas.
 * Rotas marcadas com @Optional() passam mesmo sem token.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly token: TokenPort,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const isOptional = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    const req = ctx.switchToHttp().getRequest<Request>();
    const rawToken = this.extractToken(req);

    if (!rawToken) {
      if (isOptional) return true;
      this.logger.warn(`[Auth] Sem token — ${req.method} ${req.url}`);
      throw new UnauthorizedException("Token de acesso não fornecido");
    }

    try {
      const payload = this.token.verifyAccess(rawToken);
      // @ts-ignore
      req["user"] = payload;
      return true;
    } catch {
      this.logger.warn(`[Auth] Token inválido — ${req.method} ${req.url}`);
      throw new UnauthorizedException("Token inválido ou expirado");
    }
  }

  private extractToken(req: Request): string | null {
    const auth = req.headers.authorization ?? "";
    if (auth.startsWith("Bearer ")) {
      return auth.slice(7);
    }

    return req.cookies?.["access_token"] ?? null;
  }
}
