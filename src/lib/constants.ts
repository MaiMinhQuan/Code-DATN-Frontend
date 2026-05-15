// Base URL cho các request REST API (mặc định localhost khi không có env).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

// URL WebSocket (Socket.io) dùng cho realtime (mặc định localhost khi không có env).
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";
