// Cấu hình NextAuth.js: credentials provider, callback JWT/session và trang đăng nhập custom.
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
      /*
      Xác thực email/password qua backend endpoint `/auth/login`.
      Input:
      - credentials — Email/password thô từ form đăng nhập.
      Output:
      - User object khi thành công, hoặc null để NextAuth báo lỗi đăng nhập.
      */
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

          // Map response backend sang shape User của NextAuth
          if (data?.accessToken) {
            return {
              id: data.user?._id ?? "",
              email: data.user?.email ?? "",
              name: data.user?.fullName ?? "",
              accessToken: data.accessToken,
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
    /*
    Lưu accessToken và role từ backend vào JWT (chỉ có user ở lần sign-in đầu tiên).
    Input:
    - token — Payload JWT hiện tại.
    - user — User trả về từ `authorize` (chỉ xuất hiện khi vừa đăng nhập).
    Output:
    - token: Payload JWT đã cập nhật.
    */
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id ?? "";
      }
      return token;
    },
    /*
    Đưa accessToken/role/id ra session phía client.
    Input:
    - session — Session gửi về client.
    - token — JWT đã decode (có các field custom đã persist).
    Output:
    - session: Session đã cập nhật.
    */
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.role = token.role as UserRole;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login", // dùng trang login custom thay vì trang mặc định của NextAuth
  },
  session: { strategy: "jwt" },
});
