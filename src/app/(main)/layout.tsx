import { Sidebar } from "@/components/features/layout/Sidebar";
import { Topbar } from "@/components/features/layout/Topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
