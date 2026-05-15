// Entry page `/`: kiểm tra session và điều hướng sang trang phù hợp.
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/*
Component Home
- Redirect về `/dashboard` nếu đã đăng nhập, ngược lại chuyển tới `/login`.
*/
export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard"); // Người dùng đã đăng nhập
  redirect("/login");
}
