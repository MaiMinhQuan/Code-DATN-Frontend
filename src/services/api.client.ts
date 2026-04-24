import axios from "axios";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "@/lib/constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Tự động gắn Bearer token từ NextAuth session
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Tự động redirect về /login khi token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
