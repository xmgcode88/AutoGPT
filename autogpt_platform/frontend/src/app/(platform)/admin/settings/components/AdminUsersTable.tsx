import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/__legacy__/ui/table";
import { PaginationControls } from "@/components/__legacy__/ui/pagination-controls";
import { getAdminUsers } from "../actions";

export async function AdminUsersTable({
  initialPage = 1,
  initialSearch,
}: {
  initialPage?: number;
  initialSearch?: string;
}) {
  const { users, pagination } = await getAdminUsers(
    initialPage,
    20,
    initialSearch,
  );

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(value));

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-medium">邮箱</TableHead>
              <TableHead className="font-medium">姓名</TableHead>
              <TableHead className="font-medium">用户 ID</TableHead>
              <TableHead className="font-medium">邮箱验证</TableHead>
              <TableHead className="font-medium">时区</TableHead>
              <TableHead className="font-medium">注册时间</TableHead>
              <TableHead className="text-right font-medium">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-gray-500"
                >
                  暂无用户
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name || "—"}</TableCell>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                      {user.id}
                    </code>
                  </TableCell>
                  <TableCell>{user.email_verified ? "是" : "否"}</TableCell>
                  <TableCell>{user.timezone || "not-set"}</TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      className="text-sm text-blue-600 hover:underline"
                      href={`/admin/spending?search=${encodeURIComponent(
                        user.email,
                      )}`}
                    >
                      查看消费
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={initialPage}
        totalPages={pagination.total_pages}
      />
    </div>
  );
}
