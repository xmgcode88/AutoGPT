import { withRoleAccess } from "@/lib/withRoleAccess";
import React from "react";

function AdminUsers() {
  return (
    <div>
      <h1>用户仪表盘</h1>
      {/* Add your admin-only content here */}
    </div>
  );
}

export default async function AdminUsersPage() {
  "use server";
  const withAdminAccess = await withRoleAccess(["admin"]);
  const ProtectedAdminUsers = await withAdminAccess(AdminUsers);
  return <ProtectedAdminUsers />;
}
