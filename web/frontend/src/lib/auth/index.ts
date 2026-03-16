import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode, decode } from "next-auth/jwt";
import { apiFetch, AuthResponse } from "../api";

const SESSION_MAX_AGE = 60 * 60 * 24;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        identifier: { label: "Email ou NIF", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const isNif =
          /^[0-9A-Z]+$/.test(credentials.identifier as string) &&
          !(credentials.identifier as string).includes("@");

        try {
          const endpoint = isNif ? "/auth/sign-in/nif" : "/auth/sign-in/email";
          const bodyKey = isNif ? "nif" : "email";

          const res = await apiFetch<AuthResponse>(endpoint, {
            method: "POST",
            body: JSON.stringify({
              [bodyKey]: credentials.identifier,
              password: credentials.password,
            }),
          });
          return {
            ...res.data.user,
            access_token: res.data.access_token,
          };
        } catch {
          console.error("[NextAuth] authorize API error");
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.access_token = user.access_token;
        token.balance = user.balance;
        token.avatarUrl = user.avatarUrl;
        token.name = user.name;
        token.email = user.email;
        token.nif = user.nif;
      }
      if (trigger === "update" && session) {
        token.balance = session.user.balance;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email as string;
      session.user.role = token.role;
      session.user.balance = token.balance;
      session.user.avatarUrl = token.avatarUrl;
      session.access_token = token.access_token;
      session.user.nif = token.nif;
      return session;
    },
  },

  events: {
    async signOut(message) {
      if (!("token" in message) || !message.token) return;
      try {
        await apiFetch("/auth/sign-out", {
          method: "POST",
          body: JSON.stringify({ userId: message.token.id }),
        });
      } catch {
        console.error("[NextAuth] sign-out API error");
      }
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },
});
