// Layout bảo vệ route admin — redirect về dashboard nếu không phải ADMIN.
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@/types/enums";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
