import { API_BASE_URL } from "@/lib/constants";
import { AuthResponse } from "@/types/user.types";

// Dùng `fetch` trực tiếp thay vì `apiClient` vì endpoint đăng ký không cần header Authorization.
export const authService = {
  /*
  Đăng ký tài khoản mới
  Input:
  - data — payload đăng ký (email/password/fullName).
  Output:
  - AuthResponse (thông tin user và access token).
  */
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResponse> => {
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
};
