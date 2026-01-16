"use client";

import { Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/__legacy__/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/__legacy__/ui/table";
import { Badge } from "@/components/__legacy__/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/__legacy__/ui/dropdown-menu";
import { useAPISection } from "./useAPISection";

export function APIKeysSection() {
  const { apiKeys, isLoading, isDeleting, handleRevokeKey } = useAPISection();

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        apiKeys &&
        apiKeys.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>API 密钥</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>最后使用</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id} data-testid="api-key-row">
                  <TableCell>{key.name}</TableCell>
                  <TableCell data-testid="api-key-id">
                    <div className="rounded-md border p-1 px-2 text-xs">
                      {`${key.head}******************${key.tail}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        key.status === "ACTIVE" ? "default" : "destructive"
                      }
                      className={
                        key.status === "ACTIVE"
                          ? "border-green-600 bg-green-100 text-green-800"
                          : "border-red-600 bg-red-100 text-red-800"
                      }
                    >
                      {key.status === "ACTIVE" ? "活跃" : "已撤销"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(key.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString()
                      : "从未使用"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          data-testid="api-key-actions"
                          variant="ghost"
                          size="sm"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleRevokeKey(key.id)}
                          disabled={isDeleting}
                        >
                          撤销
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
      {!isLoading && apiKeys && apiKeys.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">您还没有创建任何 API 密钥</p>
          <p className="text-sm text-muted-foreground">
            点击右上角的&quot;创建密钥&quot;按钮来创建您的第一个 API 密钥
          </p>
        </div>
      )}
    </>
  );
}
