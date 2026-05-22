"use client";

import { AdminNav } from "@/components/features/admin/AdminNav";
import { UsersManager } from "@/components/features/admin/users/UsersManager";

export default function AdminUsersPage() {
  return (
    <div>
      <AdminNav />
      <UsersManager />
    </div>
  );
}
