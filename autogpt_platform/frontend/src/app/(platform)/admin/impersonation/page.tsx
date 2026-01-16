import { AdminImpersonationPanel } from "../components/AdminImpersonationPanel";
import { Text } from "@/components/atoms/Text/Text";

export default function AdminImpersonationPage() {
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="space-y-2">
        <Text variant="h1" className="text-3xl font-bold tracking-tight">
          用户模拟
        </Text>
        <Text variant="body" className="text-gray-600">
          用于调试与支持的管理员用户模拟管理
        </Text>
      </div>

      <AdminImpersonationPanel />
    </div>
  );
}
