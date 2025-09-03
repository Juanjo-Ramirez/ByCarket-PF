import NextAuth, { DefaultSession, User as DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { processGoogleLogin } from "@/services/api.service";

interface BackendUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  isActive?: boolean;
}

interface BackendResponse {
  token: string;
  user: BackendUser;
}

declare module "next-auth" {
  interface Session {
    backendAccessToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      isActive?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    isActive?: boolean;
  }

  interface Account {
    user?: BackendUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    userId?: string;
    role?: string;
    isActive?: boolean;
    user?: BackendUser;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }): Promise<boolean> {
      if (account?.provider === "google" && profile) {
        try {
          const backendResponse = await processGoogleLogin(profile);
          if (backendResponse?.token && backendResponse?.user) {
            Object.assign(account, {
              access_token: backendResponse.token,
              user: backendResponse.user,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error en signIn:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user, profile }) {
      if (account?.access_token) {
        token.backendAccessToken = account.access_token;

        if (account.user && account.user.id) {
          token.user = account.user;
          token.userId = account.user.id;
          token.role = account.user.role;
          token.isActive = account.user.isActive;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.backendAccessToken) {
        session.backendAccessToken = token.backendAccessToken;
      }

      if (token?.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name || session.user.name,
          email: token.user.email || session.user.email,
          image: token.user.image || session.user.image,
          role: token.user.role,
          isActive: token.user.isActive,
        };
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
