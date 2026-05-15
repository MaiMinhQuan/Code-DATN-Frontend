// Axios client đã cấu hình sẵn: tự gắn token và tự sign out khi gặp 401.

import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { API_BASE_URL } from "@/lib/constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/*
Interceptor request: gắn Bearer token từ NextAuth session vào mọi request.
Input:
- config — Axios request config.
Output:
- config đã được gắn `Authorization` nếu có `session.accessToken`.
*/
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Guard chống redirect nhiều lần khi có nhiều response 401 đồng thời.
let isRedirectingToLogin = false;

/*
Interceptor response: khi token hết hạn (401) thì sign out và redirect về `/login`.
Input:
- response — Axios response (case thành công).
- error — Axios error (case thất bại).
Output:
- Trả `response` khi thành công, hoặc reject `error` khi thất bại.
*/
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" && // chỉ chạy trên browser (không chạy khi SSR)
      !isRedirectingToLogin
    ) {
      isRedirectingToLogin = true;
      signOut({ callbackUrl: "/login" }).finally(() => {
        isRedirectingToLogin = false;
      });
    }
    return Promise.reject(error);
  }
);
