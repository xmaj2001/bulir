import type { Request } from 'express';

export interface UserAgentRequest extends Request {
  useragent?: {
    browser: string;
    version: string;
    os: string;
    platform: string;
    source: string;
    isMobile: boolean;
    isDesktop: boolean;
  };
}
