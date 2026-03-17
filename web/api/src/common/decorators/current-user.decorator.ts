import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  sub:   string;
  email: string;
  role:  string;
}

/**
 * @CurrentUser() — extrai o utilizador autenticado da request.
 * Requer @UseGuards(JwtAuthGuard) ou guard global.
 *
 * Uso:
 *   @Get('me')
 *   me(@CurrentUser() user: AuthUser) { return user; }
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
