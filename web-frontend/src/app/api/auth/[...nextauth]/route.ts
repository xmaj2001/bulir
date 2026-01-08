import { AuthService } from "@/http/auth/auth.service";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    name: string;
    email: string;
    role: string;
    accessToken: string;
  }
  interface Session {
    user: {
      name: string;
      email: string;
      role: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
  }
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await AuthService.login(
          credentials?.email || "",
          credentials?.password || ""
        );

        if (!res) return null;

        return {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          accessToken: res.accessToken,
        };
      },
      
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        name: token.name || "Keymura",
        email: token.email || "hunter@keymura.com",
        role: token.role || "provider",
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
