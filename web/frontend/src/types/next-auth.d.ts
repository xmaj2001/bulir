import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    role: string;
    nif?: string | null;
    error?: "RefreshAccessTokenError";
    user: {
      id: string;
      name?: string | null;
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
    accessToken: string;
    accessTokenExpires: number;
    role: string;
    nif?: string | null;
    // refreshToken NÃO está aqui — vive só no cookie HTTP-only da API
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken: string;
    accessTokenExpires: number;
    role: string;
    nif?: string | null;
    emailVerified: boolean;
    avatarUrl?: string | null;
    balance: number;
    error?: "RefreshAccessTokenError";
    // refreshToken NÃO está aqui — vive só no cookie HTTP-only da API
  }
}
