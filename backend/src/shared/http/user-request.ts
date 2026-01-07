import type { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    sub: string;
    role: string;
  };
  cookies: {
    refreshToken?: string;
  };
}
