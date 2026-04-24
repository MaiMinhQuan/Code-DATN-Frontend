import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_BASE_URL } from "@/lib/constants";
import type { UserRole } from "@/types/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          // Điều chỉnh theo response thực tế của backend nếu cần
          if (data?.access_token) {
            return {
              id: data.user?._id ?? "",
              email: data.user?.email ?? "",
              name: data.user?.fullName ?? "",
              accessToken: data.access_token,
              role: data.user?.role ?? "STUDENT",
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id ?? "";
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.role = token.role as UserRole;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
