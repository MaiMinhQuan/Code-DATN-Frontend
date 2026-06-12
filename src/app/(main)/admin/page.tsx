"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { useAdminStats } from "@/hooks/useAdminUsers";
import {
  Users,
  FileText,
  ClipboardList,
  BookOpen,
  Tag,
  BarChart3,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function AdminPage() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { label: "Tổng người dùng", value: stats?.totalUsers ?? 0, icon: Users, color: "bg-indigo-500", href: "/admin/users" },
    { label: "Tổng bài nộp", value: stats?.totalSubmissions ?? 0, icon: ClipboardList, color: "bg-violet-500" },
    { label: "Bài đã chấm xong", value: stats?.completedSubmissions ?? 0, icon: CheckCircle, color: "bg-emerald-500" },
    { label: "Band score TB", value: stats?.avgBandScore ? `${stats.avgBandScore}` : "—", icon: TrendingUp, color: "bg-orange-500" },
    { label: "Chủ đề", value: stats?.totalTopics ?? 0, icon: Tag, color: "bg-sky-500", href: "/admin/topics" },
    { label: "Khóa học", value: stats?.totalCourses ?? 0, icon: BookOpen, color: "bg-blue-500", href: "/admin/courses" },
    { label: "Đề thi", value: stats?.totalExamQuestions ?? 0, icon: BarChart3, color: "bg-pink-500", href: "/admin/exam-questions" },
    { label: "Bài mẫu", value: stats?.totalSampleEssays ?? 0, icon: FileText, color: "bg-amber-500", href: "/admin/sample-essays" },
  ];

  return (
    <div>
      <AdminNav />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Thống kê tổng quan hệ thống</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          { href: "/admin/topics", label: "Quản lý Chủ đề ver2", desc: "Thêm, sửa, xóa topics" },
          { href: "/admin/courses", label: "Quản lý Khóa học", desc: "CRUD courses và lessons" },
          { href: "/admin/exam-questions", label: "Quản lý Đề thi", desc: "Thêm đề IELTS Writing Task 2" },
          { href: "/admin/sample-essays", label: "Quản lý Bài mẫu", desc: "Thêm bài mẫu có band score" },
          { href: "/admin/users", label: "Quản lý Người dùng", desc: "Xem danh sách và phân quyền" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-indigo-300"
          >
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
