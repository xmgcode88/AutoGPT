import { withRoleAccess } from "@/lib/withRoleAccess";
import Link from "next/link";
import React from "react";
import { SearchAndFilterAdminUsers } from "./components/SearchAndFilterAdminUsers";
import { AdminUsersTable } from "./components/AdminUsersTable";

function AdminSettings({
  page,
  search,
}: {
  page: number;
  search?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">管理员设置</h1>
        <p className="text-gray-600">
          管理员权限、用户管理入口与系统运维相关的集中说明与快捷入口。
        </p>
      </div>

      <section className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">用户管理</h2>
          <p className="text-sm text-gray-600">
            可按邮箱、姓名或用户 ID 搜索平台用户，并快速跳转到消费记录。
          </p>
        </div>
        <SearchAndFilterAdminUsers initialSearch={search} />
        <AdminUsersTable initialPage={page} initialSearch={search} />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">用户与权限</h2>
          <p className="mt-2 text-sm text-gray-600">
            本平台的管理员权限来自 Supabase 用户角色（JWT 中的 role =
            admin）。如需授予/撤销权限，请在 Supabase 的 SQL Editor 更新
            auth.users 表后重新登录以刷新 Token。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/impersonation"
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              用户模拟
            </Link>
            <Link
              href="/admin/spending"
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              用户消费
            </Link>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">认证与登录</h2>
          <p className="mt-2 text-sm text-gray-600">
            登录与密码管理由 Supabase Auth 负责。管理员用户管理通常在
            Supabase Studio 的 Auth → Users 中进行（本地默认 8082）。
          </p>
          <div className="mt-4 text-sm text-gray-500">
            建议：修改角色后务必退出并重新登录。
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">市场与审核</h2>
          <p className="mt-2 text-sm text-gray-600">
            在市场管理页面可查看提交记录、审核智能体版本并下载配置文件。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/marketplace"
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              进入市场管理
            </Link>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">执行分析</h2>
          <p className="mt-2 text-sm text-gray-600">
            用于生成缺失的执行摘要与成功评分，适合维护数据质量或补齐历史数据。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/execution-analytics"
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
              进入执行分析
            </Link>
          </div>
        </section>
      </div>

      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">系统提示</h2>
        <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
          <li>请勿在生产环境暴露管理员模拟功能给非管理员账户。</li>
          <li>敏感操作请保留审核说明与内部备注，便于追踪。</li>
          <li>遇到权限异常，优先检查 JWT 中的 role 与登录态是否已刷新。</li>
        </ul>
      </section>
    </div>
  );
}

type AdminSettingsPageSearchParams = {
  page?: string;
  search?: string;
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSettingsPageSearchParams>;
}) {
  "use server";
  const params = await searchParams;
  const page = params.page ? Number.parseInt(params.page) : 1;
  const search = params.search;
  const withAdminAccess = await withRoleAccess(["admin"]);
  const ProtectedAdminSettings = await withAdminAccess(AdminSettings);
  return <ProtectedAdminSettings page={page} search={search} />;
}
