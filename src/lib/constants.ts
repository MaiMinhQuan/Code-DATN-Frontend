// Base URL cho các request REST API từ trình duyệt (mặc định localhost khi không có env).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/** URL gọi backend từ Next.js server (NextAuth authorize) — trong Docker dùng tên service `backend`. */
export function getServerApiBaseUrl(): string {
  const internal = process.env.API_INTERNAL_URL?.replace(/\/$/, "");
  if (internal) return internal;
  return API_BASE_URL.replace(/\/$/, "");
}

// URL WebSocket (Socket.io) dùng cho realtime (mặc định localhost khi không có env).
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";
