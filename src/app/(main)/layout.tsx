// Layout khung cho toàn bộ trang chính: Sidebar, Topbar và vùng nội dung cuộn.
import { Sidebar } from "@/components/features/layout/Sidebar";
import { Topbar } from "@/components/features/layout/Topbar";

/*
Component MainLayout.

Input:
- children — nội dung trang con hiển thị trong vùng main.

Output:
- Khung giao diện chính gồm Sidebar cố định, Topbar và vùng nội dung cuộn.
*/
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        {/* Vùng nội dung chính có thể cuộn với padding thống nhất */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
