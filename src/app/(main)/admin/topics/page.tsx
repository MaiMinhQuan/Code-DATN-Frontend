"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { TopicsManager } from "@/components/features/admin/topics/TopicsManager";

export default function AdminTopicsPage() {
  return (
    <div>
      <AdminNav />
      <TopicsManager />
    </div>
  );
}
