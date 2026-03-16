import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    access_token: string;
    error?: "RefreshAccessTokenError";
    user: {
      id: string;
      role: string;
      name?: string | null;
      nif?: string | null;
      email?: string | null;
      emailVerified: boolean;
      avatarUrl?: string | null;
      balance: number;
    } & Omit<DefaultSession["user"], "emailVerified">;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified: boolean;
    avatarUrl?: string | null;
    balance: number;
    access_token: string;
    access_token_expires?: number;
    role: string;
    nif?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    access_token: string;
    access_token_expires?: number;
    role: string;
    nif?: string | null;
    emailVerified: boolean;
    avatarUrl?: string | null;
    balance: number;
    error?: "RefreshAccessTokenError";
  }
}
