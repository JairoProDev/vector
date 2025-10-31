import crypto from "node:crypto";

import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env, isDev } from "@/lib/env";

const providers = [] as NextAuthOptions["providers"];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

if (providers.length === 0) {
  providers.push(
    CredentialsProvider({
      name: "Acceso Rápido",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "founder@startup.com",
        },
        name: {
          label: "Nombre",
          type: "text",
          placeholder: "Invitado",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email) {
          return null;
        }

        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.name || "Invitado",
        };
      },
    }),
  );
}

const secret = env.NEXTAUTH_SECRET ?? crypto.randomUUID();

export const authOptions: NextAuthOptions = {
  providers,
  secret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? session.user.email ?? "unknown";
      }
      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}

