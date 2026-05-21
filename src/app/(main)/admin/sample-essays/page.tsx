"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { SampleEssaysManager } from "@/components/features/admin/sample-essays/SampleEssaysManager";

export default function AdminSampleEssaysPage() {
  return (
    <div>
      <AdminNav />
      <SampleEssaysManager />
    </div>
  );
}
