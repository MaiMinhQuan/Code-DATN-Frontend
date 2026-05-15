// Middleware Next.js: bảo vệ route bằng auth và redirect phù hợp.
import { auth } from "@/auth";
import { NextResponse } from "next/server";

/*
Handler middleware bảo vệ các route không-public.

Input:
- req — Request đã được gắn session hiện tại qua `req.auth`.

Output:
- Chưa đăng nhập mà vào route protected -> chuyển sang `/login`.
- Đã đăng nhập mà vào `/login` hoặc `/register` -> chuyển sang `/dashboard`.
*/
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPublicPage = pathname === "/";

  // Chưa login thì chặn truy cập trang protected
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Đã login thì không cho vào trang auth
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

// Áp middleware cho mọi route trừ nội bộ Next.js và static assets.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
