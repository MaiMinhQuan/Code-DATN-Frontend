import { API_BASE_URL } from "@/lib/constants";
import type { LoginResponse } from "@/types/user.types";

// Dùng `fetch` từ trình duyệt (qua Nginx) — không qua NextAuth authorize server-side.
export const authService = {
  /*
  Đăng ký tài khoản mới.
  */
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<{ _id: string; email: string; fullName: string; role: string }> => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? "Đăng ký thất bại");
    }

    return res.json();
  },

  /*
  Đăng nhập — gọi backend từ browser (hoạt động trên VPS + Docker).
  */
  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        (body as { message?: string }).message ?? "Email hoặc mật khẩu không đúng",
      );
    }

    return body as LoginResponse;
  },
};
