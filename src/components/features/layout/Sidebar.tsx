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
  History,
  Tag,
  ClipboardList,
  Users,
} from "lucide-react";
import { APP_VERSION } from "@/lib/app-version";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { UI_TEXT } from "@/constants/ui-text";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/enums";

// Nav items cho học viên
const STUDENT_NAV_ITEMS = [
  { href: "/dashboard",    icon: LayoutDashboard, label: UI_TEXT.SIDEBAR.NAV_DASHBOARD },
  { href: "/practice",     icon: PenLine,          label: UI_TEXT.SIDEBAR.NAV_PRACTICE },
  { href: "/courses",      icon: BookOpen,          label: UI_TEXT.SIDEBAR.NAV_COURSES },
  { href: "/sample-essays",icon: FileText,          label: UI_TEXT.SIDEBAR.NAV_SAMPLE_ESSAYS },
  { href: "/flashcards",   icon: CreditCard,        label: UI_TEXT.SIDEBAR.NAV_FLASHCARDS },
  { href: "/notebook",     icon: NotebookPen,       label: UI_TEXT.SIDEBAR.NAV_NOTEBOOK },
];

// Nav items cho admin (khi đang ở khu vực /admin)
const ADMIN_NAV_ITEMS = [
  { href: "/admin",                 icon: LayoutDashboard, label: "Tổng quan",    exact: true },
  { href: "/admin/topics",          icon: Tag,             label: "Chủ đề" },
  { href: "/admin/courses",         icon: BookOpen,        label: "Khóa học" },
  { href: "/admin/exam-questions",  icon: ClipboardList,   label: "Đề thi" },
  { href: "/admin/sample-essays",   icon: FileText,        label: "Bài mẫu" },
  { href: "/admin/users",           icon: Users,           label: "Người dùng" },
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
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  // Admin luôn dùng nav quản trị; học viên dùng nav học viên
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;

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
        {isSidebarOpen && (
          <span className="font-bold text-white truncate">{UI_TEXT.SIDEBAR.LOGO_TEXT}</span>
        )}
      </div>

      {/* Danh sách link điều hướng */}
      <nav className="flex-1 space-y-1 p-3 pt-4">
        {/* Label section */}
        {isSidebarOpen && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-indigo-500">
            {isAdmin ? "Quản trị" : "Menu"}
          </p>
        )}

        {navItems.map(({ href, icon: Icon, label, ...rest }) => {
          const exact = (rest as { exact?: boolean }).exact;
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
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
              {isSidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}


      </nav>

      {/* Phiên bản + lịch sử cập nhật */}
      <div className="border-t border-indigo-800 p-3">
        <Link
          href="/changelog"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors",
            pathname === "/changelog"
              ? "bg-indigo-600 text-white"
              : "text-indigo-400 hover:bg-indigo-800 hover:text-white",
          )}
        >
          <History className="h-4 w-4 shrink-0" />
          {isSidebarOpen && (
            <span className="flex min-w-0 flex-1 flex-col">
              <span>{UI_TEXT.VERSION.SIDEBAR_LABEL}</span>
              <span className="font-mono text-[10px] text-indigo-300">v{APP_VERSION}</span>
            </span>
          )}
        </Link>
        {!isSidebarOpen && (
          <p className="mt-1 text-center font-mono text-[9px] text-indigo-500">v{APP_VERSION}</p>
        )}
      </div>

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
