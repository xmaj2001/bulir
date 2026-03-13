import NextAuth, { type NextAuthConfig, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { signInEmail, signInNif } from "@/lib/api";

// ── Refresh via tua API ────────────────────────────────────────────────────────
// Chamado pelo jwt callback quando o accessToken expira.
// O cookie refresh_token da tua API é repassado manualmente no SSR.

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: refreshCookie,
        },
      },
    );
    console.log("[auth] refresh", res);
    if (!res.ok) throw new Error("Refresh falhou");

    const body = await res.json();
    const newAccessToken = body?.data?.accessToken;
    if (!newAccessToken) throw new Error("Token não recebido");

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000,
      error: undefined,
    };
  } catch (err) {
    console.error("[auth] refresh falhou:", err);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

// ── Config ─────────────────────────────────────────────────────────────────────

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Qcena",
      credentials: {
        identifier: { label: "Email ou NIF", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = credentials.identifier as string;
        const password = credentials.password as string;
        const isEmail = identifier.includes("@");

        try {
          const res = isEmail
            ? await signInEmail(identifier, password)
            : await signInNif(identifier, password);

          if (!res.success || !res.data?.accessToken) {
            console.log("[auth] authorize", res);
            return null;
          }

          const { user, accessToken } = res.data;

          // O cookie refresh_token foi setado pela API via Set-Cookie
          // O NextAuth não toca nele — só guarda o accessToken no seu JWT
          return {
            id: user.id,
            name: user.name,
            email: user.email ?? null,
            nif: user.nif ?? null,
            emailVerified: user.emailVerified,
            avatarUrl: user.avatarUrl ?? null,
            balance: user.balance,
            role: user.role,
            accessToken,
            accessTokenExpires: Date.now() + 14 * 60 * 1000,
          } satisfies User;
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  cookies: {
    // Nome diferente do cookie da API — sem conflito
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User;
        return {
          ...token,
          id: u.id,
          accessToken: u.accessToken,
          accessTokenExpires: u.accessTokenExpires,
          role: u.role,
          nif: u.nif ?? null,
          emailVerified: u.emailVerified,
          avatarUrl: u.avatarUrl ?? null,
          balance: u.balance,
          error: undefined,
        };
      }

      if (Date.now() < ((token.accessTokenExpires as number) ?? 0)) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.role = token.role as string;
      session.error = token.error as "RefreshAccessTokenError" | undefined;
      session.nif = token.nif as string | null | undefined;

      session.user.id = token.id as string;
      // session.user.emailVerified = true;
      session.user.avatarUrl = token.avatarUrl as string | null | undefined;
      session.user.balance = token.balance as number;

      return session;
    },
  },

  events: {
    async signOut() {
      try {
        const cookieStore = await cookies();
        const allCookies = cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/auth/sign-out`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: allCookies,
            },
          },
        );
      } catch (err) {
        console.error("[auth] sign-out API error:", err);
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
