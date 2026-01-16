import { withRoleAccess } from "@/lib/withRoleAccess";
import { Suspense } from "react";
import { ExecutionAnalyticsForm } from "./components/ExecutionAnalyticsForm";

function ExecutionAnalyticsDashboard() {
  return (
    <div className="mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">执行分析</h1>
            <p className="text-gray-500">
              为执行记录生成缺失的活动摘要与成功评分
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">分析生成</h2>
          <p className="mb-6 text-gray-600">
            该工具会识别已完成但缺少活动摘要或成功评分的执行记录，并使用 AI
            自动生成。仅处理符合条件且缺少这些字段的执行记录。
          </p>

          <Suspense
            fallback={<div className="py-10 text-center">加载中...</div>}
          >
            <ExecutionAnalyticsForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default async function ExecutionAnalyticsPage() {
  "use server";
  const withAdminAccess = await withRoleAccess(["admin"]);
  const ProtectedExecutionAnalyticsDashboard = await withAdminAccess(
    ExecutionAnalyticsDashboard,
  );
  return <ProtectedExecutionAnalyticsDashboard />;
}
