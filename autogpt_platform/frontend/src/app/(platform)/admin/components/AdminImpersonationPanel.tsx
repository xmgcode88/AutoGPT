"use client";

import { useState } from "react";
import { UserMinus, UserCheck, CreditCard } from "@phosphor-icons/react";
import { Card } from "@/components/atoms/Card/Card";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { Alert, AlertDescription } from "@/components/molecules/Alert/Alert";
import { useAdminImpersonation } from "./useAdminImpersonation";
import { useGetV1GetUserCredits } from "@/app/api/__generated__/endpoints/credits/credits";

export function AdminImpersonationPanel() {
  const [userIdInput, setUserIdInput] = useState("");
  const [error, setError] = useState("");
  const {
    isImpersonating,
    impersonatedUserId,
    startImpersonating,
    stopImpersonating,
  } = useAdminImpersonation();

  // Demo: Use existing credits API - it will automatically use impersonation if active
  const {
    data: creditsResponse,
    isLoading: creditsLoading,
    error: creditsError,
  } = useGetV1GetUserCredits();

  function handleStartImpersonation() {
    setError("");

    if (!userIdInput.trim()) {
      setError("请输入有效的用户 ID");
      return;
    }

    // Basic UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userIdInput.trim())) {
      setError("请输入有效的 UUID 格式用户 ID");
      return;
    }

    try {
      startImpersonating(userIdInput.trim());
      setUserIdInput("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "开始模拟失败",
      );
    }
  }

  function handleStopImpersonation() {
    stopImpersonating();
    setError("");
  }

  return (
    <Card className="w-full max-w-2xl">
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div className="mb-2 flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <h2 className="text-xl font-semibold">管理员用户模拟</h2>
          </div>
          <p className="text-sm text-gray-600">
            用于调试与支持，以管理员身份代表其他用户操作
          </p>
        </div>

        {/* Security Warning */}
        <Alert variant="error">
          <AlertDescription>
            <strong>安全提示：</strong>此功能仅用于管理员调试与支持。所有
            模拟操作都会记录以便审计。
          </AlertDescription>
        </Alert>

        {/* Current Status */}
        {isImpersonating && (
          <Alert variant="warning">
            <AlertDescription>
              <strong>当前模拟用户：</strong>{" "}
              <code className="rounded bg-amber-100 px-1 font-mono text-sm">
                {impersonatedUserId}
              </code>
            </AlertDescription>
          </Alert>
        )}

        {/* Impersonation Controls */}
        <div className="space-y-3">
          <Input
            label="要模拟的用户 ID"
            id="user-id-input"
            placeholder="例如：2e7ea138-2097-425d-9cad-c660f29cc251"
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            disabled={isImpersonating}
            error={error}
          />

          <div className="flex space-x-2">
            <Button
              onClick={handleStartImpersonation}
              disabled={isImpersonating || !userIdInput.trim()}
              className="min-w-[100px]"
            >
              {isImpersonating ? "已启用" : "开始"}
            </Button>

            {isImpersonating && (
              <Button
                onClick={handleStopImpersonation}
                variant="secondary"
                leftIcon={<UserMinus className="h-4 w-4" />}
              >
                停止模拟
              </Button>
            )}
          </div>
        </div>

        {/* Demo: Live Credits Display */}
        <Card className="bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <h3 className="text-sm font-medium">实时演示：用户积分</h3>
            </div>

            {creditsLoading ? (
              <p className="text-sm text-gray-600">正在加载积分...</p>
            ) : creditsError ? (
              <Alert variant="error">
                <AlertDescription className="text-sm">
                  加载积分出错：{" "}
                  {creditsError &&
                  typeof creditsError === "object" &&
                  "message" in creditsError
                    ? String(creditsError.message)
                    : "未知错误"}
                </AlertDescription>
              </Alert>
            ) : creditsResponse?.data ? (
              <div className="space-y-1">
                <p className="text-sm">
                  <strong>
                    {creditsResponse.data &&
                    typeof creditsResponse.data === "object" &&
                    "credits" in creditsResponse.data
                      ? String(creditsResponse.data.credits)
                      : "无"}
                  </strong>{" "}
                  可用积分
                  {isImpersonating && (
                    <span className="ml-2 text-amber-600">
                      （通过模拟）
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {isImpersonating
                    ? `显示用户 ${impersonatedUserId} 的积分`
                    : "显示你自己的积分"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">暂无积分数据</p>
            )}
          </div>
        </Card>

        {/* Instructions */}
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <strong>说明：</strong>
          </p>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li>输入要模拟用户的 UUID</li>
            <li>
              现有 API 会自动使用模拟身份
            </li>
            <li>模拟启用时会显示警告横幅</li>
            <li>
              本次会话刷新页面后模拟仍会保持
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
