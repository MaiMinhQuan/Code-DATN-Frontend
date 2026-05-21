"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { CoursesManager } from "@/components/features/admin/courses/CoursesManager";

export default function AdminCoursesPage() {
  return (
    <div>
      <AdminNav />
      <CoursesManager />
    </div>
  );
}
