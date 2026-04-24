import { API_BASE_URL } from "@/lib/constants";
import { AuthResponse } from "@/types/user.types";

// Chỉ dùng fetch thuần (không qua axios) vì register không cần auth
export const authService = {
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
