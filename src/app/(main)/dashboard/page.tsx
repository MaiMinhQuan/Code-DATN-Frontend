// Trang dashboard: đọc session phía server và render khối dashboard phía client.
import { auth } from "@/auth";
import { UI_TEXT } from "@/constants/ui-text";
import { DashboardClient } from "@/components/features/dashboard/DashboardClient";

/*
Component DashboardPage.

Output:
- Lời chào theo tên người dùng và component `DashboardClient` cho phần thống kê tương tác.
*/
export default async function DashboardPage() {
  const session = await auth();
  // Dùng tên mặc định nếu session không có display name
  const name = session?.user?.name ?? UI_TEXT.COMMON.FALLBACK_USER_NAME;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {UI_TEXT.DASHBOARD.GREETING(name)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {UI_TEXT.DASHBOARD.SUBHEADING}
        </p>
      </div>

      {/* Component client xử lý fetch dữ liệu và widget tương tác */}
      <DashboardClient />
    </div>
  );
}
