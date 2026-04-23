import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://demo.edubacards.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data } = await axios.post(`${API_BASE}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
            deviceUuid: "admin-panel",
          });

          // Response shape: { status: "success", data: { user: {...}, accessToken: "..." } }
          if (data?.status === "success" && data?.data?.accessToken) {
            const user = data.data.user;
            return {
              id: user.id,
              name: user.fullName,
              email: user.email,
              role: user.role,
              accessToken: data.data.accessToken,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.role = (user as { role?: string }).role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});