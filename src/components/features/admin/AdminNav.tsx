"use client";

// Sub-navigation ngang trong khu vực Admin.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tag,
  BookOpen,
  ClipboardList,
  FileText,
  Users,
  Wand2,
} from "lucide-react";

const ADMIN_TABS = [
  { href: "/admin",             icon: LayoutDashboard, label: "Tổng quan",    exact: true },
  { href: "/admin/topics",      icon: Tag,             label: "Chủ đề" },
  { href: "/admin/courses",     icon: BookOpen,        label: "Khóa học" },
  { href: "/admin/exam-questions", icon: ClipboardList, label: "Đề thi" },
  { href: "/admin/sample-essays",  icon: FileText,     label: "Bài mẫu" },
  { href: "/admin/users",       icon: Users,           label: "Người dùng" },
  { href: "/admin/pipeline",    icon: Wand2,           label: "Pipeline" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
      {ADMIN_TABS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
