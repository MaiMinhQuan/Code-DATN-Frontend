"use client";

// Sidebar điều hướng chính của khu vực đã đăng nhập.
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenLine,
  BookOpen,
  FileText,
  CreditCard,
  NotebookPen,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { UI_TEXT } from "@/constants/ui-text";

// Danh sách route điều hướng hiển thị trong sidebar.
const NAV_ITEMS = [
  { href: "/dashboard",    icon: LayoutDashboard, label: UI_TEXT.SIDEBAR.NAV_DASHBOARD },
  { href: "/practice",     icon: PenLine,          label: UI_TEXT.SIDEBAR.NAV_PRACTICE },
  { href: "/courses",      icon: BookOpen,          label: UI_TEXT.SIDEBAR.NAV_COURSES },
  { href: "/sample-essays",icon: FileText,          label: UI_TEXT.SIDEBAR.NAV_SAMPLE_ESSAYS },
  { href: "/flashcards",   icon: CreditCard,        label: UI_TEXT.SIDEBAR.NAV_FLASHCARDS },
  { href: "/notebook",     icon: NotebookPen,       label: UI_TEXT.SIDEBAR.NAV_NOTEBOOK },
];

/*
Component sidebar điều hướng.

Input:
- Không có props.

Output:
- Sidebar có thể thu gọn/mở rộng, highlight route active và điều hướng trang.
*/
export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col bg-indigo-950 text-indigo-100 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Khu vực logo */}
      <div className="flex h-16 items-center gap-3 border-b border-indigo-800 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {/* Tên thương hiệu chỉ hiện khi sidebar mở */}
        {isSidebarOpen && (
          <span className="font-bold text-white truncate">{UI_TEXT.SIDEBAR.LOGO_TEXT}</span>
        )}
      </div>

      {/* Danh sách link điều hướng */}
      <nav className="flex-1 space-y-1 p-3 pt-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          // Active khi path trùng route hoặc là route con
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-300 hover:bg-indigo-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {/* Ẩn label khi sidebar ở trạng thái thu gọn */}
              {isSidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Nút thu gọn/mở rộng sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 bottom-8 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-500"
      >
        {/* Mũi tên xoay khi sidebar đang đóng */}
        <ChevronLeft
          className={cn("h-3.5 w-3.5 transition-transform", !isSidebarOpen && "rotate-180")}
        />
      </button>
    </aside>
  );
}
